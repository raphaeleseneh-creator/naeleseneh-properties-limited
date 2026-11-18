"use node";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// Emails the team when a listing is submitted. Runs only on the server.
// Needs Convex env vars RESEND_API_KEY, NOTIFY_FROM_EMAIL, NOTIFY_TO_EMAIL.
// If they are not set the action does nothing (submission is still saved).
export const newSubmission = internalAction({
  args: { listingId: v.id("listings") },
  handler: async (ctx, { listingId }) => {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.NOTIFY_FROM_EMAIL;
    const to = process.env.NOTIFY_TO_EMAIL;
    if (!key || !from || !to) return;

    const row = await ctx.runQuery(internal.notifyData.getForEmail, { listingId });
    if (!row) return;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New listing submission: ${row.title}`,
        text: [
          `From: ${row.submitterName} (${row.submitterRole})`,
          `Email: ${row.submitterEmail}`,
          `Phone: ${row.submitterPhone}`,
          row.agencyName ? `Agency: ${row.agencyName}` : "",
          `Property: ${row.title} - ${row.area}, ${row.city}`,
          `Price: ${row.priceDisplay}`,
          "",
          "Review it in the staff portal.",
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });
  },
});
