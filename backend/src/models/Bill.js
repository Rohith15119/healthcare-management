import mongoose from 'mongoose'

const billSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    items: [
      {
        description: String,
        price: Number,
      },
    ],
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paymentMethod: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'], default: 'card' },
    transactionId: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
)

export default mongoose.model('Bill', billSchema)
