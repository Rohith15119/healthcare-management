import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true },
    name: { type: String, required: true },
    // doctor-specific
    specialization: { type: String },
    experienceYears: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    // patient-specific
    age: { type: Number },
    phone: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
