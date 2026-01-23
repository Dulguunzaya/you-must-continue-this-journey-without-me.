import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import User from '@/backend/models/user';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { validateEmail } from '@/backend/lib/auth';

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

        if (!email) {
            return NextResponse.json(
                { message: 'И-мэйл шаардлагатай' },
                { status: 400 }
            );
        }

        if (!validateEmail(email)) {
            return NextResponse.json(
                { message: 'И-мэйл хаяг буруу байна' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return NextResponse.json(
                { message: 'Хэрэглэгч олдсонгүй' },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: 'Хэрэглэгч аль хэдийн баталгаажсан байна' },
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
            subject: 'OTP баталгаажуулах - Automated Billiard',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #10b981;">Automated Billiard 🎱</h2>
                        <p>Сайн байна уу, <strong>${user.name}</strong>!</p>
                        <p>Таны шинэ OTP код:</p>
                        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #10b981; margin: 0; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
                        </div>
                        <p style="color: #666;">Энэ код 10 минутын дараа хүчингүй болно.</p>
                    </div>
                </div>
            `
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