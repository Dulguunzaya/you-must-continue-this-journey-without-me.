import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import User from '@/backend/models/user';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { hashPassword, generateToken, validateEmail, validatePassword } from '@/backend/lib/auth';

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

        // Validation
        if (!name || name.trim().length < 2) {
            return NextResponse.json(
                { message: 'Нэр хамгийн багадаа 2 тэмдэгт байх ёстой' },
                { status: 400 }
            );
        }

        if (!validateEmail(email)) {
            return NextResponse.json(
                { message: 'И-мэйл хаяг буруу байна' },
                { status: 400 }
            );
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { message: passwordValidation.message },
                { status: 400 }
            );
        }

        let user = await User.findOne({ email });
        if (user) {
            return NextResponse.json(
                { message: 'Хэрэглэгч аль хэдийн бүртгэгдсэн байна' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user = new User({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password: hashedPassword, 
            otp, 
            otpExpiry 
        });
        await user.save();

        await transporter.sendMail({
            from: 'dukmongonshagai@gmail.com',
            to: email,
            subject: 'OTP Verification - Automated Billiard',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #10b981;">Automated Billiard 🎱</h2>
                        <p>Сайн байна уу, <strong>${name}</strong>!</p>
                        <p>Таны OTP код:</p>
                        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #10b981; margin: 0; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
                        </div>
                        <p style="color: #666;">Энэ код 10 минутын дараа хүчингүй болно.</p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">Хэрэв та энэ бүртгэлийг хийгээгүй бол энэ и-мэйлийг үл тоомсорлоно уу.</p>
                    </div>
                </div>
            `
        });

        return NextResponse.json(
            { 
                message: 'Хэрэглэгч бүртгэгдсэн. И-мэйлдээ OTP-г илгээгдлээ.',
                email: email
            },
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