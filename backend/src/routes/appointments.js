import { Router } from "express";
import Appointment from "../models/Appointment.js";
import Bill from "../models/Bill.js";
import { authRequired, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get("/", authRequired, async (_req, res) => {
  const appts = await Appointment.find()
    .populate("patient", "name")
    .populate("doctor", "name specialization");
  res.json(appts);
});
router.get("/:id", authRequired, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("patient", "name email")
      .populate("doctor", "name specialization")
      .populate("billId");
    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appt);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointment", error: error.message });
  }
});
router.post(
  "/:id/bill",
  authRequired,
  allowRoles("doctor", "admin"),
  async (req, res) => {
    const { id } = req.params;
    const { items, amount, currency } = req.body;
    const bill = await Bill.create({
      appointment: id,
      items,
      amount,
      currency,
    });
    await Appointment.findByIdAndUpdate(id, { billId: bill._id });
    res.status(201).json(bill);
  }
);
router.post(
  "/:id/pay",
  authRequired,
  allowRoles("patient"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentMethod, amount, service } = req.body;
      const appt = await Appointment.findById(id);
      if (!appt)
        return res.status(404).json({ message: "Appointment not found" });
      if (appt.status !== "accepted")
        return res.status(400).json({
          message: "Appointment must be accepted by doctor before payment",
        });
      if (appt.paymentStatus === "paid")
        return res
          .status(400)
          .json({ message: "Payment already processed for this appointment" });
      // Create or update bill
      let bill = await Bill.findOne({ appointment: id });
      if (!bill) {
        bill = await Bill.create({
          appointment: id,
          amount: amount || 500,
          currency: "INR",
          items: [
            {
              description: service || "Medical Consultation",
              price: amount || 500,
            },
          ],
        });
        await Appointment.findByIdAndUpdate(id, { billId: bill._id });
      }
      // Update payment status
      const transactionId = "TXN" + Date.now();
      await Appointment.findByIdAndUpdate(id, { paymentStatus: "paid" });
      await Bill.findByIdAndUpdate(bill._id, {
        status: "paid",
        paymentMethod: paymentMethod || "card",
        transactionId: transactionId,
        paidAt: new Date(),
      });
      res.json({
        message: "Payment processed successfully",
        transactionId: transactionId,
        amount: bill.amount,
        status: "paid",
        paymentMethod: paymentMethod || "card",
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      res
        .status(500)
        .json({ message: "Payment processing failed", error: error.message });
    }
  }
);
export default router;
