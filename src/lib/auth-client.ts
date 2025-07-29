import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  customSessionClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";
import { adminClient } from "better-auth/client/plugins";
import { ac, roles } from "@/lib/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({ ac, roles }),
    customSessionClient<typeof auth>(),
    magicLinkClient(),
  ],
});

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  admin,
  sendVerificationEmail,
  forgetPassword,
  resetPassword,
  updateUser,
} = authClient;
