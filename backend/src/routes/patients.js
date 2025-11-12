import { Router } from "express";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { authRequired, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get(
  "/doctors",
  authRequired,
  allowRoles("patient"),
  async (_req, res) => {
    const doctors = await User.find({ role: "doctor" }).select(
      "name specialization experienceYears rating ratingCount"
    );
    res.json(doctors);
  }
);
router.post(
  "/appointments",
  authRequired,
  allowRoles("patient"),
  async (req, res) => {
    const { doctorId, scheduledAt, patientNotes } = req.body;
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: req.user.id,
      scheduledAt,
      patientNotes,
      status: "pending",
    });
    res.status(201).json(appointment);
  }
);
router.get(
  "/appointments",
  authRequired,
  allowRoles("patient"),
  async (req, res) => {
    const appts = await Appointment.find({ patient: req.user.id }).populate(
      "doctor",
      "name specialization"
    );
    res.json(appts);
  }
);
export default router;
