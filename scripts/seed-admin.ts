/**
 * Run with: npx tsx scripts/seed-admin.ts
 * 
 * Creates an admin user in the database (or updates existing user to ADMIN role).
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://Dulguunzaya:Dukduk019216@cluster0.4emxqun.mongodb.net/?appName=Cluster0";

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

async function main() {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    const email = 'admin@billiard.com';
    const password = 'admin123';

    const existing = await User.findOne({ email });
    if (existing) {
        existing.role = 'ADMIN';
        existing.isVerified = true;
        await existing.save();
        console.log('Existing user updated to ADMIN role');
    } else {
        const hashed = await bcrypt.hash(password, 10);
        await User.create({
            name: 'Admin',
            email,
            password: hashed,
            role: 'ADMIN',
            isVerified: true
        });
        console.log('Admin user created');
    }

    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ADMIN`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
