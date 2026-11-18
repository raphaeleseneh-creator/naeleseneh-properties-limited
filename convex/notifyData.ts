import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

// Internal only: not callable from the browser.
export const getForEmail = internalQuery({
  args: { listingId: v.id("listings") },
  handler: async (ctx, { listingId }) => ctx.db.get(listingId),
});
