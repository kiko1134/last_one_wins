import User from "../models/User.js";

export const register = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Има потребител с този имейл" });
    }

    // Създаване на нов потребител
    const newUser = new User({ email, username, password });
    await newUser.save();

    // Съхраняваме user данните в сесията
    req.session.user = {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
    };

    res.status(201).json({ message: "Регистрацията е успешна" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Невалидни данни" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Невалидни данни" });

    // Съхраняваме user данните в сесията
    req.session.user = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    res.json({ message: "Входът е успешен" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Logout - унищожаваме сесията
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });

    res.clearCookie("connect.sid"); // Изчистваме cookie-то
    res.json({ message: "Logged out successfully" });
  });
};

export const checkAuth = (req, res) => {
  if (req.session.user) {
    return res.json({ user: req.session.user });
  }
  res.status(401).json({ message: "Unauthorized" });
};
