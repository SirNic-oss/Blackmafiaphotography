import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";

const prisma = new PrismaClient();

async function runSql(file: string) {
  const sql = readFileSync(path.join(__dirname, "..", "src", "prisma", "migrations", file, "migration.sql"), "utf8");
  for (const statement of sql.split(";").map((s) => s.trim()).filter(Boolean)) {
    await prisma.$executeRawUnsafe(statement);
  }
}

async function main() {
  await runSql("202608220003_add_business_content");
  console.log("✅ Testimonial and SiteSetting tables ensured");
  const settings = await prisma.siteSetting.findFirst();
  if (!settings) {
    await prisma.siteSetting.create({
      data: {
        businessName: "Lumen Studio",
        email: "hello@lumenstudio.com",
        phone: "+27 82 000 0000",
        location: "Johannesburg, South Africa",
        instagram: "https://instagram.com/lumenstudio",
        about: "Natural light photography for portraits, couples, and families.",
      },
    });
    console.log("✅ Default site settings created");
  }
}

main()
  .catch((error) => {
    console.error("Migration ensure failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
