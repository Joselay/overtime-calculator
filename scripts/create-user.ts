import * as argon2 from "argon2";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";

async function createUser() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.error("Usage: bun run scripts/create-user.ts <username> <password>");
    process.exit(1);
  }

  try {
    const hashedPassword = await argon2.hash(password);

    const [newUser] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning();

    console.log(`✅ User created successfully!`);
    console.log(`Username: ${newUser.username}`);
    console.log(`User ID: ${newUser.id}`);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    process.exit(1);
  }

  process.exit(0);
}

createUser();
