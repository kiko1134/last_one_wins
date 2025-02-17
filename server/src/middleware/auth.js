export const authenticateSession = (req, res, next) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ message: "Access denied. Not authenticated." });
  }

  req.user = req.session.user;
  next();
};
