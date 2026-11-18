import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { approvalValidator, roleValidator } from "./schema";
import { requireStaff, requireUser } from "./lib";

// Current user's own access state (safe fields only).
export const me = query({
  args: {},
  handler: async (ctx) => {
    let user;
    try {
      user = await requireUser(ctx);
    } catch {
      return null;
    }
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      emailVerified: Boolean(user.emailVerificationTime),
      role: user.role,
      approvalStatus: user.approvalStatus,
    };
  },
});

// Staff: list accounts for the approvals screen.
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireStaff(ctx);
    const users = await ctx.db.query("users").order("desc").take(500);
    return users.map((u) => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      agencyName: u.agencyName,
      emailVerified: Boolean(u.emailVerificationTime),
      role: u.role,
      approvalStatus: u.approvalStatus,
      _creationTime: u._creationTime,
    }));
  },
});

// Staff: approve / reject / suspend an account and set its role.
export const setAccess = mutation({
  args: {
    userId: v.id("users"),
    role: roleValidator,
    approvalStatus: approvalValidator,
  },
  handler: async (ctx, args) => {
    const staff = await requireStaff(ctx);
    const target = await ctx.db.get(args.userId);
    if (!target) throw new Error("User not found");
    if (target._id === staff._id) throw new Error("You cannot change your own access");
    if (args.approvalStatus === "approved" && args.role !== "none" && !target.emailVerificationTime) {
      throw new Error("The user's email is not verified yet");
    }
    await ctx.db.patch(args.userId, {
      role: args.role,
      approvalStatus: args.approvalStatus,
      approvedBy: args.approvalStatus === "approved" ? staff._id : undefined,
      approvedAt: args.approvalStatus === "approved" ? Date.now() : undefined,
    });
  },
});

// Staff: invite an email to become realtor/staff. Takes effect only after that
// email signs up AND verifies it, via claimInvite below.
export const invite = mutation({
  args: { email: v.string(), role: v.union(v.literal("realtor"), v.literal("staff")) },
  handler: async (ctx, args) => {
    const staff = await requireStaff(ctx);
    const email = args.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email");
    await ctx.db.insert("invites", {
      email,
      role: args.role,
      invitedBy: staff._id,
      createdAt: Date.now(),
    });
  },
});

// Signed-in user with a VERIFIED email claims a matching staff invitation.
export const claimInvite = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    if (!user.emailVerificationTime || !user.email) {
      throw new Error("Verify your email first");
    }
    const pending = await ctx.db
      .query("invites")
      .withIndex("by_email", (q) => q.eq("email", user.email!.toLowerCase()))
      .collect();
    const invite = pending.find((i) => !i.claimedAt);
    if (!invite) return { claimed: false as const };
    await ctx.db.patch(invite._id, { claimedAt: Date.now() });
    await ctx.db.patch(user._id, {
      role: invite.role,
      approvalStatus: "approved",
      approvedBy: invite.invitedBy,
      approvedAt: Date.now(),
    });
    return { claimed: true as const, role: invite.role };
  },
});

// First staff account. Internal = callable ONLY from the Convex dashboard or CLI:
//   npx convex run roles:bootstrapStaff '{"email":"you@example.com"}'
// The user must already have signed up and verified their email.
export const bootstrapStaff = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email.trim().toLowerCase()))
      .unique();
    if (!user) throw new Error("No account with that email. Sign up first.");
    if (!user.emailVerificationTime) throw new Error("Email not verified yet.");
    await ctx.db.patch(user._id, {
      role: "staff",
      approvalStatus: "approved",
      approvedAt: Date.now(),
    });
  },
});
