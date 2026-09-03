import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@lumenstudio.com";
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword, role: "ADMIN", firstName: "Studio", lastName: "Admin" },
    create: { email: adminEmail, password: adminPassword, role: "ADMIN", firstName: "Studio", lastName: "Admin" },
  });
  console.log(`✅ Admin user ready (${adminEmail} / admin123)`);

  try {
    const existingSettings = await prisma.siteSetting.findFirst();
    if (!existingSettings) {
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
      console.log("✅ Site settings seeded");
    }
  } catch (error) {
    console.warn("⚠️ Site settings table unavailable — run database migrations if needed.");
  }
  const services = [
    { name: "Portrait Session", description: "A relaxed individual or personal-branding session.", durationMinutes: 60, price: 1800, displayOrder: 1 },
    { name: "Couples Session", description: "A natural, story-led session for two.", durationMinutes: 90, price: 2600, displayOrder: 2 },
    { name: "Family Session", description: "A family photography experience with time for everyone.", durationMinutes: 90, price: 3200, displayOrder: 3 },
  ];

  for (const service of services) {
    await prisma.photographyService.upsert({
      where: { name: service.name },
      update: service,
      create: service,
    });
  }

  const products = [
    {
      name: "example",
      category: "Shoes",
      description: "Premium lightweight runner with sculpted sole.",
      price: 3500,
      images: [
        "http://localhost:5000/uploads/products/shoe1.jpeg",
      ],
      colors: ["Black", "White"],
      sizes: ["8", "9", "10", "11"],
      stock: 24,
    },
    {
      name: "example",
      category: "Shoes",
      description: "Premium lightweight runner with sculpted sole.",
      price: 2750,
      images: [
        "http://localhost:5000/uploads/products/shoe2.jpeg",
      ],
      colors: ["Black", "White"],
      sizes: ["8", "9", "10", "11"],
      stock: 24,
    },
    {
      name: "example",
      category: "Shoes",
      description: "Premium lightweight runner with sculpted sole.",
      price: 2750,
      images: [
        "http://localhost:5000/uploads/products/shoe3.jpeg",
      ],
      colors: ["Black", "White"],
      sizes: ["8", "9", "10", "11"],
      stock: 24,
    },
    {
      name: "example",
      category: "Shoes",
      description: "Premium lightweight runner with sculpted sole.",
      price: 2750,
      images: [
        "http://localhost:5000/uploads/products/shoe4.jpeg",
      ],
      colors: ["Black", "White"],
      sizes: ["8", "9", "10", "11"],
      stock: 24,
    },
  ];

  for (const product of products) {
    const exists = await prisma.product.findFirst({
      where: {
        name: product.name,
        images: {
          has: product.images[0],
        },
      },
    });

    if (!exists) {
      await prisma.product.create({
        data: product,
      });

      console.log(`✅ Added ${product.images[0]}`);
    } else {
      console.log(`⏩ Skipped ${product.images[0]}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
