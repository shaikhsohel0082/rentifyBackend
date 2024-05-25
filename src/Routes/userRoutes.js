import express from "express";
import { createUser } from "../Controllers/userController.js";
import { loginUser } from "../Controllers/userController.js";
import { findUserById } from "../Controllers/userController.js";
const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/:id", findUserById);

export default userRouter;
