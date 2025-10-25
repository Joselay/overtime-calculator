import { db } from './lib/db';
import { users } from './lib/db/schema';
import * as argon2 from 'argon2';

async function seed() {
  try {
    const defaultUsername = process.env.DEFAULT_USERNAME;
    const defaultPassword = process.env.DEFAULT_PASSWORD;
    const defaultEmail = process.env.DEFAULT_EMAIL;
    const defaultBaseSalary = process.env.DEFAULT_BASE_SALARY;
    const defaultAvatar = process.env.DEFAULT_AVATAR;

    if (!defaultUsername || !defaultPassword || !defaultEmail || !defaultBaseSalary || !defaultAvatar) {
      throw new Error('DEFAULT_USERNAME, DEFAULT_PASSWORD, DEFAULT_EMAIL, DEFAULT_BASE_SALARY, and DEFAULT_AVATAR must be set in .env file');
    }

    console.log('🌱 Seeding database...');

    // Hash the password
    const hashedPassword = await argon2.hash(defaultPassword);

    // Create default user
    const [user] = await db.insert(users).values({
      username: defaultUsername,
      password: hashedPassword,
      email: defaultEmail,
      baseSalary: parseFloat(defaultBaseSalary),
      avatar: defaultAvatar,
    }).returning();

    console.log('✅ Default user created:');
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Base Salary: ${user.baseSalary}`);
    console.log(`   Avatar: ${user.avatar}`);
    console.log('\n🎉 Seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
