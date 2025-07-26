import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { Session, session } from "./session";
import { Account, account } from "./account";
import { Post, post } from "./post";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  // role: text("role"),
  role: roleEnum("role").default("USER").notNull(),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  posts: many(post),
}));

export type Role = "USER" | "ADMIN";
export type User = InferSelectModel<typeof user>;
export type UserExt = User & {
  sessions: Session[];
  accounts: Account[];
  posts: Post[];
};
