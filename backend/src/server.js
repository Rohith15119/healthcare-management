import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import doctorRoutes from "./routes/doctors.js";
import patientRoutes from "./routes/patients.js";
import appointmentRoutes from "./routes/appointments.js";
import roleRoutes from "./routes/roles.js";
import recordRoutes from "./routes/records.js";
import billingRoutes from "./routes/billing.js";
import feedbackRoutes from "./routes/feedback.js";
import User from "./models/User.js";
dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://rohith123:rohith123@cluster1.a2ei2ew.mongodb.net/healthcare?retryWrites=true&w=majority&authSource=admin";
const PORT = process.env.PORT || 4000;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(async () => {
    console.log("MongoDB connected successfully");
    await ensureSeedData();
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    console.log(
      "Please ensure your MongoDB Atlas cluster allows connections from any IP (0.0.0.0/0)"
    );
    process.exit(1);
  });
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/records", recordRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
async function ensureSeedData() {
  try {
    // Seed default admin
    const adminEmail = "jhon@admin";
    const adminPassword = "12345678";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const adminHash = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail,
        passwordHash: adminHash,
        role: "admin",
        name: "System Admin",
      });
      console.log("Seeded default admin account (jhon@admin)");
    }
    // Seed a few default doctors for demo/testing
    const doctors = [
      {
        email: "alice.smith@clinic.test",
        password: "doctor123",
        name: "Dr. Alice Smith",
        specialization: "Cardiologist",
        experienceYears: 12,
        rating: 4.8,
        ratingCount: 129,
      },
      {
        email: "brian.lee@clinic.test",
        password: "doctor123",
        name: "Dr. Brian Lee",
        specialization: "Dermatologist",
        experienceYears: 8,
        rating: 4.6,
        ratingCount: 94,
      },
      {
        email: "neha.patel@clinic.test",
        password: "doctor123",
        name: "Dr. Neha Patel",
        specialization: "Neurologist",
        experienceYears: 10,
        rating: 4.9,
        ratingCount: 173,
      },
    ];
    for (const d of doctors) {
      const existing = await User.findOne({ email: d.email });
      if (!existing) {
        const hash = await bcrypt.hash(d.password, 10);
        await User.create({
          email: d.email,
          passwordHash: hash,
          role: "doctor",
          name: d.name,
          specialization: d.specialization,
          experienceYears: d.experienceYears,
          rating: d.rating,
          ratingCount: d.ratingCount,
        });
        console.log(`Seeded doctor: ${d.name}`);
      }
    }
  } catch (e) {
    console.error("Seeding error:", e);
  }
}
