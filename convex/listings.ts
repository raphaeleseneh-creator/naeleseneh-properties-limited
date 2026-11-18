import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { moderationStatus } from "./schema";
import { requireStaff, slugify } from "./lib";

const MAX_PHOTOS = 8;

function clean(s: string, max: number) {
  return s.trim().slice(0, max);
}

/* ------------------------------ PUBLIC ------------------------------ */

// Short-lived upload URL so the browser can send photos straight to Convex storage.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

// Public submission. Status is forced to pending_review server-side.
export const submit = mutation({
  args: {
    submitterRole: v.union(v.literal("owner"), v.literal("realtor")),
    submitterName: v.string(),
    submitterEmail: v.string(),
    submitterPhone: v.string(),
    agencyName: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    transactionType: v.union(v.literal("sale"), v.literal("rent"), v.literal("lease")),
    category: v.union(v.literal("land"), v.literal("residential"), v.literal("commercial")),
    area: v.string(),
    city: v.string(),
    state: v.string(),
    priceNumeric: v.number(),
    landSize: v.string(),
    titleDocument: v.string(),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    features: v.array(v.string()),
    photoStorageIds: v.array(v.id("_storage")),
    website: v.optional(v.string()), // honeypot: real users leave this empty
  },
  handler: async (ctx, args) => {
    if (args.website) return { ok: true as const }; // silently drop bots
    const email = clean(args.submitterEmail, 200).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email");
    if (clean(args.submitterName, 120).length < 2) throw new Error("Name is required");
    if (clean(args.submitterPhone, 40).length < 7) throw new Error("Phone is required");
    if (clean(args.title, 140).length < 5) throw new Error("Title is too short");
    if (clean(args.description, 4000).length < 20) throw new Error("Description is too short");
    if (!(args.priceNumeric > 0)) throw new Error("Price must be greater than zero");
    if (args.photoStorageIds.length > MAX_PHOTOS) throw new Error("Too many photos");

    const description = clean(args.description, 4000);
    const id = await ctx.db.insert("listings", {
      submitterRole: args.submitterRole,
      submitterName: clean(args.submitterName, 120),
      submitterEmail: email,
      submitterPhone: clean(args.submitterPhone, 40),
      agencyName: args.agencyName ? clean(args.agencyName, 140) : undefined,
      title: clean(args.title, 140),
      summary: description.slice(0, 160),
      description,
      transactionType: args.transactionType,
      category: args.category,
      area: clean(args.area, 100),
      city: clean(args.city, 100),
      state: clean(args.state, 100),
      priceNumeric: args.priceNumeric,
      priceDisplay: `₦${Math.round(args.priceNumeric).toLocaleString("en-NG")}`,
      availability: "Available",
      landSize: clean(args.landSize, 80),
      titleDocument: clean(args.titleDocument, 120),
      bedrooms: args.bedrooms,
      bathrooms: args.bathrooms,
      features: args.features.slice(0, 20).map((f) => clean(f, 120)).filter(Boolean),
      photoStorageIds: args.photoStorageIds,
      moderationStatus: "pending_review",
      featured: false,
      updatedAt: Date.now(),
    });
    await ctx.scheduler.runAfter(0, internal.notify.newSubmission, { listingId: id });
    return { ok: true as const };
  },
});

// Public directory: approved listings only, with no submitter contact data.
export const listApproved = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("moderationStatus", "approved"))
      .order("desc")
      .take(200);
    return Promise.all(
      rows.map(async (r) => ({
        _id: r._id,
        referenceCode: r.referenceCode,
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        description: r.description,
        transactionType: r.transactionType,
        category: r.category,
        location: { area: r.area, city: r.city, state: r.state },
        priceNumeric: r.priceNumeric,
        priceDisplay: r.priceDisplay,
        priceCadence: r.priceCadence,
        availability: r.availability,
        featured: r.featured,
        specifications: {
          landSize: r.landSize,
          titleDocument: r.titleDocument,
          bedrooms: r.bedrooms,
          bathrooms: r.bathrooms,
        },
        features: r.features,
        photoUrls: (
          await Promise.all(r.photoStorageIds.map((id) => ctx.storage.getUrl(id)))
        ).filter((u): u is string => u !== null),
        updatedAt: r.updatedAt,
      }))
    );
  },
});

/* ------------------------------- STAFF ------------------------------ */

export const listForReview = query({
  args: { status: v.optional(moderationStatus) },
  handler: async (ctx) => {
    await requireStaff(ctx);
    const rows = await ctx.db.query("listings").order("desc").take(300);
    return Promise.all(
      rows.map(async (r) => ({
        ...r,
        photoUrls: (
          await Promise.all(r.photoStorageIds.map((id) => ctx.storage.getUrl(id)))
        ).filter((u): u is string => u !== null),
      }))
    );
  },
});

export const review = mutation({
  args: {
    id: v.id("listings"),
    decision: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("changes_requested")
    ),
    notes: v.optional(v.string()),
    referenceCode: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const staff = await requireStaff(ctx);
    const row = await ctx.db.get(args.id);
    if (!row) throw new Error("Listing not found");

    const patch: Record<string, unknown> = {
      moderationStatus: args.decision,
      reviewNotes: args.notes ? clean(args.notes, 1000) : row.reviewNotes,
      reviewedBy: staff.email,
      reviewedAt: Date.now(),
      updatedAt: Date.now(),
    };
    if (args.featured !== undefined) patch.featured = args.featured;

    if (args.decision === "approved") {
      const ref = args.referenceCode?.trim() || row.referenceCode;
      if (!ref) throw new Error("Assign a reference code (e.g. NPL-123) before approving");
      let slug = slugify(`${row.title}-${ref}`);
      const clash = await ctx.db
        .query("listings")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      if (clash && clash._id !== row._id) slug = `${slug}-${Date.now().toString(36)}`;
      patch.referenceCode = ref;
      patch.slug = slug;
    }
    await ctx.db.patch(args.id, patch);
  },
});

// Phase 1 cleanup: staff can unpublish by moving back to pending/rejected via review().
