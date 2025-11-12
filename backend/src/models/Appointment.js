import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    scheduledAt: { type: Date, required: true },
    patientNotes: { type: String },
    doctorNotes: { type: String },
    billId: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);
export default mongoose.model("Appointment", appointmentSchema);
