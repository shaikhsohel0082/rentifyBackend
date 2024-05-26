import express from "express";
import connectToDB from "./src/config/mongodb.js";
import userRouter from "./src/Routes/userRoutes.js";
import postRouter from "./src/Routes/postRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const server = express();

server.use(express.json());

server.use(cors());

// Middleware to log cookies for debugging
server.use((req, res, next) => {
  // console.log("Cookies: ", req.cookies);
  next();
});

server.get("/", (req, res) => {
  res.send("Welcome to backend");
});

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

server.listen(process.env.PORT || 8200, () => {
  console.log(`Server is listening on port${process.env.PORT || 8200}`);
  connectToDB();
});
