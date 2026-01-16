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
        
        const { email } = await req.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: 'Хэрэглэгч олдсонгүй' },
                { status: 400 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: 'Хэрэглэгч бүртгэгдсэн байна' },
                { status: 400 }
            );
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await transporter.sendMail({
            from: 'dukmongonshagai@gmail.com',
            to: email,
            subject: 'OTP баталгаажуулах',
            text: `Нууц үг: ${otp}`
        });

        return NextResponse.json(
            { message: 'OTP амжилттай дахин илгээгдлээ.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Resend OTP error:', error);
        return NextResponse.json(
            { 
                message: 'OTP-г дахин илгээхэд алдаа гарлаа',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}