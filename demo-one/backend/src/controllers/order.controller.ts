import { PrismaClient } from "@prisma/client";

const prisma =
  new PrismaClient();

export const createOrder =
  async (
    req: any,
    res: any
  ) => {
    const order =
      await prisma.order.create({
        data: {
          userId:
            req.user.userId,
          total:
            req.body.total,
        },
      });

    res.json(order);
  };

export const getOrders =
  async (
    req: any,
    res: any
  ) => {
    const orders =
      await prisma.order.findMany();

    res.json(orders);
  };