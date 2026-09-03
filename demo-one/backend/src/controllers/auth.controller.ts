import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "dev-access-secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

const generateAccessToken = (userId: string) =>
  jwt.sign({ userId }, JWT_ACCESS_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (userId: string) =>
  jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const register = async (
  req: any,
  res: any
) => {
  const {
    email,
    password,
  } = req.body;

  const hash =
    await bcrypt.hash(password, 10);

  const user =
    await prisma.user.create({
      data: {
        email,
        password: hash,
      },
    });

  res.json(user);
};

export const login = async (
    req: any,
    res: any
  ) => {
    const {
      email,
      password,
    } = req.body;
  
    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });
  
    if (!user) {
      return res
        .status(401)
        .json({
          message: "Invalid credentials",
        });
    }
  
    const valid =
      await bcrypt.compare(
        password,
        user.password
      );
  
    if (!valid) {
      return res
        .status(401)
        .json({
          message: "Invalid credentials",
        });
    }
  
    const access =
      generateAccessToken(user.id);
  
    const refresh =
      generateRefreshToken(user.id);
  
    res.cookie(
      "refreshToken",
      refresh,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      }
    );
  
    res.json({
      access,
      user: {
        id: user.id,
        email: user.email,
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email.split("@")[0],
        role: user.role,
      },
    });
  };
