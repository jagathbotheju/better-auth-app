import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";
import { adminClient } from "better-auth/client/plugins";
import { ac, roles } from "@/lib/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>(), adminClient({ ac, roles })],
});

export const { signUp, signIn, signOut, useSession, admin } = authClient;
