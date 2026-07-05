import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch cart items for the current user
export const getCart = async (req: Request, res: Response) => {
  try {
    // For simplicity, let's assume user ID is coming from a session or token
    const userId = req.user.id; // Ensure you get user info from auth middleware or a session

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: true, // If you want product details
      },
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
    const userId = req.user.id; // Ensure this comes from auth
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
    const userId = req.user.id; // Ensure this comes from auth
    const { itemId } = req.params;

    await prisma.cart.delete({
      where: { id: itemId, userId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};