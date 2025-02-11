import { loginUser, registerUser } from "../services/service.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await loginUser(username, password);
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await registerUser(username, password);
    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
