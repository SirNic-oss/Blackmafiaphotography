import { PrismaClient } from "@prisma/client";
import { backendBaseUrl } from "../config/backend";

const prisma = new PrismaClient();

async function main() {
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
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
