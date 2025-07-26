import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/server/db/schema";
import { db } from "@/server/db";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { ac, roles } from "@/lib/permissions";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  // account:{
  //   accountLinking:{
  //     enabled:false
  //   }
  // },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: "USER",
      adminRoles: ["ADMIN"],
      ac,
      roles,
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAIL?.split(",") ?? [];

          if (ADMIN_EMAILS.includes(user.email)) {
            console.log("user", { ...user, role: "ADMIN" });
            return { data: { ...user, role: "ADMIN" } };
          }
          return { data: user };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "USER",
        enum: ["USER", "ADMIN"],
        input: false,
      },
      id: {
        type: "string",
        input: false,
      },
    },
  },
});
