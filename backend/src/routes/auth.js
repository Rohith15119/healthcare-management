import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = Router();
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      name,
      specialization,
      experienceYears,
      age,
      phone,
    } = req.body;
    if (!email || !password || !role || !name)
      return res.status(400).json({ message: "Missing fields" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      role,
      name,
      specialization: role === "doctor" ? specialization : undefined,
      experienceYears: role === "doctor" ? experienceYears : undefined,
      age: role === "patient" ? age : undefined,
      phone,
    });
    return res.status(201).json({ id: user._id });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    return res.json({ token, role: user.role, name: user.name });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});
export default router;
