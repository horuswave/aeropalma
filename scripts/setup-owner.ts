#!/usr/bin/env node
// scripts/setup-owner.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createInterface } from "readline";


const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log("\n🔐 AeroPalma Survey - Owner Setup\n");

  try {
    const email = await question("Enter owner email: ");
    const password = await question("Enter owner password: ");
    const confirmPassword = await question("Confirm password: ");

    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match");
      process.exit(1);
    }

    if (password.length < 8) {
      console.log("❌ Password must be at least 8 characters");
      process.exit(1);
    }

    // Check if owner already exists
    const existingOwner = await prisma.owner.findUnique({
      where: { email },
    });

    if (existingOwner) {
      console.log(`❌ Owner with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create owner
    const owner = await prisma.owner.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log(`\n✅ Owner created successfully!`);
    console.log(`   Email: ${owner.email}`);
    console.log(`   ID: ${owner.id}`);
    console.log(`\n👉 You can now sign in with these credentials.\n`);
  } catch (error) {
    console.error("Setup error:", error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
