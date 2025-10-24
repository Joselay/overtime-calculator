'use server';

import { redirect } from "next/navigation";
import * as argon2 from "argon2";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "./auth";

export async function login(prevState: { error: string; timestamp?: number } | null, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required", timestamp: Date.now() };
  }

  try {
    // Find user by username
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      return { error: "Invalid username or password", timestamp: Date.now() };
    }

    // Verify password
    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) {
      return { error: "Invalid username or password", timestamp: Date.now() };
    }

    // Create session
    const session = await getSession();
    session.userId = user.id;
    session.username = user.username;
    session.isLoggedIn = true;
    await session.save();

  } catch (error) {
    console.error("Login error:", error);
    return { error: "An error occurred during login", timestamp: Date.now() };
  }

  redirect("/");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
