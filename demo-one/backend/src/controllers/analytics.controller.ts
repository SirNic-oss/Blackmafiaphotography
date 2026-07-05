import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dashboardStats =
  async (
    req: any,
    res: any
  ) => {
    const users =
      await prisma.user.count();

    const products =
      await prisma.product.count();

    const orders =
      await prisma.order.count();

    res.json({
      users,
      products,
      orders,
    });
  };