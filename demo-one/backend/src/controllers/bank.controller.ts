import { Request, Response } from "express";
import { bankDetails } from "../config/bank";

export const getBankDetails = (
  req: Request,
  res: Response
) => {
  res.json(bankDetails);
};