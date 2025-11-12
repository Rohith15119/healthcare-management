import { Router } from "express";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import { authRequired, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get("/", authRequired, async (_req, res) => {
  const doctors = await User.find({ role: "doctor" }).select("-passwordHash");
  res.json(doctors);
});
router.get(
  "/appointments",
  authRequired,
  allowRoles("doctor"),
  async (req, res) => {
    const appts = await Appointment.find({ doctor: req.user.id })
      .populate("patient", "name age")
      .sort("-scheduledAt");
    res.json(appts);
  }
);
router.post(
  "/appointments/:id/accept",
  authRequired,
  allowRoles("doctor"),
  async (req, res) => {
    const { id } = req.params;
    const appt = await Appointment.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );
    res.json(appt);
  }
);
router.post(
  "/appointments/:id/reject",
  authRequired,
  allowRoles("doctor"),
  async (req, res) => {
    const { id } = req.params;
    const appt = await Appointment.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    res.json(appt);
  }
);
router.post(
  "/appointments/:id/complete",
  authRequired,
  allowRoles("doctor"),
  async (req, res) => {
    const { id } = req.params;
    const appt = await Appointment.findById(id);
    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });
    if (appt.status !== "accepted")
      return res
        .status(400)
        .json({ message: "Appointment must be accepted first" });
    appt.status = "completed";
    await appt.save();
    res.json(appt);
  }
);
export default router;
