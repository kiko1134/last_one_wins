import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users = []; // Temporary in-memory storage

export const loginUser = async (username, password) => {
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  return jwt.sign({ username }, "VaPStTKrV", { expiresIn: "100y" });
};

export const registerUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword };
  users.push(newUser);
  return newUser;
};
