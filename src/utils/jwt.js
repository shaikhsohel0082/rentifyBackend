import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secret, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};
