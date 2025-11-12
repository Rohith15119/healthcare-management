import mongoose from 'mongoose'

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    diagnosis: { type: String },
    prescriptions: [
      {
        medicine: String,
        dosage: String,
        durationDays: Number,
        instructions: String,
      },
    ],
    reports: [
      {
        name: String,
        url: String, // in a real app, this would be an upload URL
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('MedicalRecord', medicalRecordSchema)
