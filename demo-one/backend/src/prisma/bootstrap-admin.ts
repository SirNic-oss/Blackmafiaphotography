import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: passwordHash, role: "ADMIN", firstName: "Black Mafia", lastName: "Photography" },
    create: { email, password: passwordHash, role: "ADMIN", firstName: "Black Mafia", lastName: "Photography" },
  });
  console.log(`Admin user ready: ${email}`);
}

main()
  .finally(async () => prisma.$disconnect());
