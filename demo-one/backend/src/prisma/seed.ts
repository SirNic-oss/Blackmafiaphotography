import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@blackmafiaphotography.com";
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword, role: "ADMIN", firstName: "Black Mafia", lastName: "Admin" },
    create: { email: adminEmail, password: adminPassword, role: "ADMIN", firstName: "Black Mafia", lastName: "Admin" },
  });

  if (!(await prisma.siteSetting.findFirst())) {
    await prisma.siteSetting.create({
      data: { businessName: "Black Mafia Photography" },
    });
  }

  const services = [
    { name: "Portrait Session", description: "A relaxed individual or personal-branding session.", durationMinutes: 60, price: 1800, displayOrder: 1 },
    { name: "Couples Session", description: "A natural, story-led session for two.", durationMinutes: 90, price: 2600, displayOrder: 2 },
    { name: "Family Session", description: "A family photography experience with time for everyone.", durationMinutes: 90, price: 3200, displayOrder: 3 },
  ];

  for (const service of services) {
    await prisma.photographyService.upsert({
      where: { name: service.name }, update: service, create: service,
    });
  }
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
