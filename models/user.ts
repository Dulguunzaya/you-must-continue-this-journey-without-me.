import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpiry: { type: Date }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

 