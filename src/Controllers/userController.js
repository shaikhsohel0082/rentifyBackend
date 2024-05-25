import userModel from "../Models/userModel.js";
import { generateToken } from "../utils/jwt.js";
export const createUser = async (req, res) => {
  try {
    console.log("createUser started");
    console.log(req.body);

    const { firstName, lastName, email, phoneNumber, password, type } =
      req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new userModel({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      type,
    });
    const savedUser = await user.save();
    const sendUser = { ...savedUser._doc, password: "" };
    res.status(201).json({ message: "User created", user: sendUser });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    const sendUser = { ...user._doc, password: "" };
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = generateToken(user._id);
    res
      .status(200)
      .json({ message: "Login successful", token, user: sendUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const findUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    const sendUser = { ...user._doc, password: "" };
    res.status(200).json({ user: sendUser });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
