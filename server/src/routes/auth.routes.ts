import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { sendWelcomeEmail } from "../lib/mailer.js";
import { AuthRequest, protect } from "../middleware/auth.js";


const router = Router();

router.post("/register", async (req, res) => {
  const { fullName, age, email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { fullName, age, email, password: hashed },
  });

  sendWelcomeEmail(email, fullName);
  res.status(201).json({ message: "Registered successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  });

  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,          // must be true in production (HTTPS only)
  sameSite: "none",      // required for cross-domain cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

  res.json({ id: user.id, fullName: user.fullName, role: user.role, photoUrl: user.photoUrl });
});

// router.post("/logout", (_req, res) => {
//   res.clearCookie("token");
//   res.json({ message: "Logged out" });
// });

router.post("/logout", (_req, res) => {
  res.clearCookie("token", { secure: true, sameSite: "none" });
  res.json({ message: "Logged out" });
});



router.get("/me", protect, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json({ id: user.id, fullName: user.fullName, role: user.role, photoUrl: user.photoUrl });
});



export default router;