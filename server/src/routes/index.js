import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/game");
  }

  res.redirect("/login");
});

export default router;
