import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ResetPasswordOTP, VerifyEmailOTP } from "./emailOtp";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      // Only email + name are read from the client. Role/approval can never be
      // supplied by the browser.
      profile(params) {
        const email = String(params.email ?? "").trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email");
        const name = params.name ? String(params.name).trim().slice(0, 120) : undefined;
        return { email, ...(name ? { name } : {}) };
      },
      validatePasswordRequirements(password: string) {
        if (
          password.length < 10 ||
          !/[a-z]/i.test(password) ||
          !/[0-9]/.test(password)
        ) {
          throw new Error("Password must be 10+ characters and include letters and numbers.");
        }
      },
      verify: VerifyEmailOTP, // email verification on sign-up
      reset: ResetPasswordOTP, // password recovery
    }),
  ],
  callbacks: {
    // New accounts are ALWAYS unapproved with no role. Existing users keep
    // their role/approval; sign-in never modifies them.
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        if (args.profile.emailVerified) {
          await ctx.db.patch(args.existingUserId, { emailVerificationTime: Date.now() });
        }
        return args.existingUserId;
      }
      return ctx.db.insert("users", {
        email: args.profile.email,
        name: args.profile.name as string | undefined,
        ...(args.profile.emailVerified ? { emailVerificationTime: Date.now() } : {}),
        role: "none",
        approvalStatus: "pending",
      });
    },
  },
});
