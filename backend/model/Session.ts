import { Schema, model } from "mongoose";

const SessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tableId: {
    type: Schema.Types.ObjectId,
    ref: 'Table',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  totalCost: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

SessionSchema.pre('save', function(this: any, next: any) {
  this.updatedAt = new Date();
  next();
});

SessionSchema.methods.calculateCost = function(pricePerMinute: number): number {
  if (!this.isActive && this.endTime) {
    const durationInMinutes = Math.ceil((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60));
    return durationInMinutes * pricePerMinute;
  }
  return 0;
};

export default model("Session", SessionSchema);
