import { Router } from "express";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import { authRequired, allowRoles } from "../middleware/auth.js";
const router = Router();
router.post(
  "/:appointmentId",
  authRequired,
  allowRoles("patient"),
  async (req, res) => {
    const { appointmentId } = req.params;
    const { rating, comment } = req.body;
    const appt = await Appointment.findById(appointmentId);
    if (!appt || String(appt.patient) !== req.user.id) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    // Simple rating aggregation on doctor profile
    const doctor = await User.findById(appt.doctor);
    const newCount = (doctor.ratingCount || 0) + 1;
    const newRating =
      ((doctor.rating || 0) * (doctor.ratingCount || 0) + rating) / newCount;
    doctor.rating = newRating;
    doctor.ratingCount = newCount;
    await doctor.save();
    res.status(201).json({
      message: "Feedback recorded",
      rating: doctor.rating,
      ratingCount: doctor.ratingCount,
      comment,
    });
  }
);
export default router;
