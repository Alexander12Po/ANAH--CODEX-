import mongoose from 'mongoose';

const chatIASchema = new mongoose.Schema({
  jid: {
    type: String,
    required: true,
    unique: true
  },
  activo: {
    type: Boolean,
    default: false
  },
  historial: {
    type: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true }
      }
    ],
    default: []
  }
}, { timestamps: true });

export default mongoose.models.ChatIA || mongoose.model('ChatIA', chatIASchema);
