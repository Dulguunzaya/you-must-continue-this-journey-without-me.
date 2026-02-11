import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    totalCost: { type: Number, default: 0 }
}, { timestamps: true });

const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);

export default Session;
