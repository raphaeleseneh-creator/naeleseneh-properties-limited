import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const moderationStatus = v.union(
  v.literal("pending_review"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("changes_requested")
);

// Account roles are NEVER taken from client input. New accounts are always
// role "none" + approvalStatus "pending" (see convex/auth.ts). Only staff
// (convex/roles.ts) or the CLI-only bootstrap can change them.
export const roleValidator = v.union(
  v.literal("none"),
  v.literal("realtor"),
  v.literal("staff")
);
export const approvalValidator = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("suspended")
);

export default defineSchema({
  ...authTables,

  // Replaces the default auth `users` table to add role + approval fields.
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: roleValidator,
    approvalStatus: approvalValidator,
    agencyName: v.optional(v.string()),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
  }).index("email", ["email"]),

  // Staff-created invitations. Applied only after the invited email is verified.
  invites: defineTable({
    email: v.string(),
    role: v.union(v.literal("realtor"), v.literal("staff")),
    invitedBy: v.id("users"),
    createdAt: v.number(),
    claimedAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // One table for submissions and public listings. Only rows with
  // moderationStatus === "approved" are ever returned to the public.
  listings: defineTable({
    // Submitter (private - never returned by public queries)
    submitterRole: v.union(v.literal("owner"), v.literal("realtor")),
    submitterName: v.string(),
    submitterEmail: v.string(),
    submitterPhone: v.string(),
    agencyName: v.optional(v.string()),
    // Phase 3: set when an approved realtor submits while signed in
    ownerUserId: v.optional(v.id("users")),

    // Property (mirrors src/types/realEstate.ts PropertyListing)
    referenceCode: v.optional(v.string()),
    slug: v.optional(v.string()),
    title: v.string(),
    summary: v.string(),
    description: v.string(),
    transactionType: v.union(v.literal("sale"), v.literal("rent"), v.literal("lease")),
    category: v.union(v.literal("land"), v.literal("residential"), v.literal("commercial")),
    area: v.string(),
    city: v.string(),
    state: v.string(),
    priceNumeric: v.number(),
    priceDisplay: v.string(),
    priceCadence: v.optional(v.string()),
    availability: v.string(),
    landSize: v.string(),
    titleDocument: v.string(),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    features: v.array(v.string()),
    photoStorageIds: v.array(v.id("_storage")),

    // Moderation
    moderationStatus,
    featured: v.boolean(),
    reviewNotes: v.optional(v.string()),
    reviewedBy: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_status", ["moderationStatus", "updatedAt"])
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerUserId"]),
});
