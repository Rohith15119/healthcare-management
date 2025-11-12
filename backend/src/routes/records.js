import { Router } from "express";
import MedicalRecord from "../models/MedicalRecord.js";
import { authRequired, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get(
  "/",
  authRequired,
  allowRoles("admin", "doctor"),
  async (req, res) => {
    const filter = req.user.role === "doctor" ? { doctor: req.user.id } : {};
    const records = await MedicalRecord.find(filter)
      .populate("patient", "name")
      .populate("doctor", "name");
    res.json(records);
  }
);
router.post("/", authRequired, allowRoles("doctor"), async (req, res) => {
  const { patient, appointment, diagnosis, prescriptions, reports } = req.body;
  const record = await MedicalRecord.create({
    patient,
    appointment,
    doctor: req.user.id,
    diagnosis,
    prescriptions,
    reports,
  });
  res.status(201).json(record);
});
router.get("/mine", authRequired, allowRoles("patient"), async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.user.id }).populate(
    "doctor",
    "name"
  );
  res.json(records);
});
export default router;
