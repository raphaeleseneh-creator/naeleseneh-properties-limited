import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

/** Signed-in user document, or throws. */
export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("Not authenticated");
  return user;
}

/**
 * Staff gate. Role and approval are read from the database (never from the
 * client), and the email must be verified. Used by every staff function.
 */
export async function requireStaff(ctx: QueryCtx | MutationCtx) {
  const user = await requireUser(ctx);
  if (
    user.role !== "staff" ||
    user.approvalStatus !== "approved" ||
    !user.emailVerificationTime
  ) {
    throw new Error("Not authorized");
  }
  return user;
}

/** Approved, verified realtor (staff also pass). For the realtor phase. */
export async function requireRealtor(ctx: QueryCtx | MutationCtx) {
  const user = await requireUser(ctx);
  const okRole = user.role === "realtor" || user.role === "staff";
  if (!okRole || user.approvalStatus !== "approved" || !user.emailVerificationTime) {
    throw new Error("Not authorized");
  }
  return user;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
