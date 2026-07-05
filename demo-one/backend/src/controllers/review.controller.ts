import { PrismaClient } from "@prisma/client";

const prisma =
  new PrismaClient();

export const createReview =
  async (
    req: any,
    res: any
  ) => {
    const review =
      await prisma.review.create({
        data: {
          rating:
            req.body.rating,
          comment:
            req.body.comment,
          userId:
            req.user.userId,
          productId:
            req.body.productId,
        },
      });

    res.json(review);
  };