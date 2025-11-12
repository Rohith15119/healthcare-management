import { Router } from "express";
import Role from "../models/Role.js";
import { authRequired, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get("/", authRequired, allowRoles("admin"), async (_req, res) => {
  const roles = await Role.find();
  res.json(roles);
});
router.post("/", authRequired, allowRoles("admin"), async (req, res) => {
  const { name, description, permissions } = req.body;
  const role = await Role.create({ name, description, permissions });
  res.status(201).json(role);
});
router.delete("/:id", authRequired, allowRoles("admin"), async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
export default router;
