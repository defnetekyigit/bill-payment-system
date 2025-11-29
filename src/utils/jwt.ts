import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default_secret";

export const generateToken = (payload: any, expiresIn = "1h") => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};
