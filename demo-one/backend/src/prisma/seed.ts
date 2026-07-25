import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { backendBaseUrl } from "../config/backend";

const prisma = new PrismaClient();

async function main() {
  // =====================================================
  // ADMIN ACCOUNT
  // =====================================================

  const adminEmail = "kgethomakofane@gmail.com";
  const adminPassword = "6IXG#D2004";

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        role: UserRole.ADMIN,
      },
    });

    console.log("✅ Admin account created.");
  } else {
    console.log("⏩ Admin account already exists.");
  }

  // =====================================================
  // SAMPLE PRODUCTS
  // =====================================================

  const products = [
    {
      name: "example",
      category: "Shoes",
      description: "Premium lightweight runner with sculpted sole.",
      price: 3500,
      images: [
        `${backendBaseUrl}/uploads/products/shoe1.jpeg`,
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
        `${backendBaseUrl}/uploads/products/shoe2.jpeg`,
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
        `${backendBaseUrl}/uploads/products/shoe3.jpeg`,
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
        `${backendBaseUrl}/uploads/products/shoe4.jpeg`,
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

  console.log("🎉 Database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });