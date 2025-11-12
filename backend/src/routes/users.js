import { Router } from "express";
import User from "../models/User.js";
import { authRequired, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get("/me", authRequired, async (req, res) => {
  const me = await User.findById(req.user.id).select("-passwordHash");
  res.json(me);
});
router.get("/", authRequired, allowRoles("admin"), async (_req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
});
router.post("/role", authRequired, allowRoles("admin"), async (req, res) => {
  const { userId, role } = req.body;
  const updated = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-passwordHash");
  res.json(updated);
});
router.post(
  "/create-role",
  authRequired,
  allowRoles("admin"),
  async (req, res) => {
    // Backward compat placeholder; handled in /roles routes now
    res.json({ message: "Use /api/roles to manage dynamic roles" });
  }
);
router.post(
  "/cleanup-duplicates",
  authRequired,
  allowRoles("admin"),
  async (_req, res) => {
    const users = await User.aggregate([
      { $group: { _id: "$email", ids: { $push: "$_id" }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]);
    let removed = 0;
    for (const g of users) {
      const [keep, ...dups] = g.ids;
      if (dups.length) {
        const r = await User.deleteMany({ _id: { $in: dups } });
        removed += r.deletedCount || 0;
      }
    }
    res.json({ removed });
  }
);
export default router;
