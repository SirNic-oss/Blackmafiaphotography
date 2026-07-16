import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUserId = (req: Request, res: Response): string | null => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return req.user.id;
};

const getItemId = (req: Request): string | null => {
  const { itemId } = req.params;
  if (Array.isArray(itemId)) {
    return itemId[0] ?? null;
  }
  return itemId ?? null;
};

// Fetch cart items for the current user
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const cartItems = await prisma.cart.findMany({
      where: { userId },
     // Remove the include for now
    });

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Add a product to the cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { productId, quantity } = req.body;

    // Check if item already exists in cart
    let cartItem = await prisma.cart.findFirst({
      where: { userId, productId },
    });

    if (cartItem) {
      // Update quantity if it already exists
      cartItem = await prisma.cart.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity + quantity,
        },
      });
    } else {
      // Add new item to the cart
      cartItem = await prisma.cart.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }

    res.json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// Remove an item from the cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const itemId = getItemId(req);
    if (!itemId) {
      return res.status(400).json({ error: "Item ID required" });
    }

    await prisma.cart.delete({
      where: { id: itemId, userId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};
