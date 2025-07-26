"use server";

import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { user, User } from "@/server/db/schema/user";
import { and, eq, ne } from "drizzle-orm";
import { headers } from "next/headers";

export const getUsers = async () => {
  const allUsers = await db.query.user.findMany();
  return allUsers as User[];
};

export const deleteUser = async (userId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return { error: "UnAuthorized" };
  if (session.user.role !== "ADMIN" || session.user.id === userId) {
    return { error: "Forbidden" };
  }

  const deletedUser = await db
    .delete(user)
    .where(and(eq(user.id, userId), ne(user.role, "ADMIN")))
    .returning();
  if (deletedUser) {
    return { success: "User deleted successfully" };
  }

  return { error: "Could not delete user, please try again" };
};
