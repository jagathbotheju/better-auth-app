import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/server/db/schema";
import { db } from "@/server/db";
import { nextCookies } from "better-auth/next-js";
import { admin, customSession, magicLink } from "better-auth/plugins";
import { ac, roles } from "@/lib/permissions";
import { sendEmailAction } from "@/server/backend/actions/mailActions";

const options = {
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
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmailAction({
        to: user.email,
        subject: "Reset your password",
        meta: {
          description: "Please click the link below to reset the password",
          link: url,
        },
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set("callbackURL", "/auth/verify");

      await sendEmailAction({
        to: user.email,
        subject: "Verify your Email Address",
        meta: {
          description:
            "Please verify your email address to complete registration",
          link: String(link),
        },
      });
    },
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
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmailAction({
          to: email,
          subject: "Magic Link Login",
          meta: {
            description: "Please click the link below to login",
            link: url,
          },
        });
      },
    }),
  ],

  session: {
    expiresIn: 30 * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, //5 min
    },
  },

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
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      return {
        session: {
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          role: user.role,
          testField: "testField",
        },
      };
    }, options),
  ],
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
