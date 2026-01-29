import { Schema, model } from "mongoose";

const TableSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["AVAILABLE", "PLAYING", "DISABLED"],
    default: "AVAILABLE",
  },
  pricePerMinute: {
    type: Number,
    required: true,
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

TableSchema.pre('save', function(this: any, next: any) {
  this.updatedAt = new Date();
  next();
});

export default model("Table", TableSchema);
