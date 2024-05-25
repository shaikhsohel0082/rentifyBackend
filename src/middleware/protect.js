import dotenv from "dotenv";

import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js";
dotenv.config();
const secret = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  let token;
  console.log("Checking authorization header...");

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("inside protect middleware");
      console.log(token);
      const decoded = jwt.verify(token, secret);

      req.userModel = await userModel.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed", error });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
