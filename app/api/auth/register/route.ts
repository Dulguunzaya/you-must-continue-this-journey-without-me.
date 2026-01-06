import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import User from '@/models/user';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dukmongonshagai@gmail.com',
        pass: 'fqpprdhbwvogsgku'
    }
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        
        const { name, email, password } = await req.json();

        let user = await User.findOne({ email });
        if (user) {
            return NextResponse.json(
                { message: 'Хэрэглэгч аль хэдийн бүртгэгдсэн байна' },
                { status: 400 }
            );
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user = new User({ name, email, password, otp, otpExpiry });
        await user.save();

        await transporter.sendMail({
            from: 'dukmongonshagai@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Нууц үг: ${otp}`
        });

        return NextResponse.json(
            { message: 'Хэрэглэгч бүртгэгдсэн. И-мэйлдээ OTP-г илгээгдлээ.' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { 
                message: 'Хэрэглэгчийг бүртгэхэд алдаа гарлаа',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
