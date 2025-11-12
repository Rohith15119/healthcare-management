import { Router } from "express";
import Bill from "../models/Bill.js";
import { authRequired, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get(
  "/",
  authRequired,
  allowRoles("admin", "doctor"),
  async (_req, res) => {
    const bills = await Bill.find().populate({
      path: "appointment",
      select: "patient doctor status paymentStatus",
    });
    res.json(bills);
  }
);
export default router;
