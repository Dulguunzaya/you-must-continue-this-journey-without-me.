import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import User from '@/models/user';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { validateEmail } from '@/lib/auth';

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
                { message: 'Энэ и-мэйл хаягаар бүртгэлтэй хэрэглэгч олдсонгүй' },
                { status: 404 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { message: 'Та эхлээд и-мэйлээ баталгаажуулна уу' },
                { status: 400 }
            );
        }

        const resetOTP = generateOTP();
        const resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.resetPasswordOTP = resetOTP;
        user.resetPasswordOTPExpiry = resetOTPExpiry;
        
        try {
            await user.save();
            console.log('Reset OTP saved successfully for user:', user.email);
        } catch (saveError) {
            console.error('Error saving reset OTP:', saveError);
            throw saveError;
        }

        await transporter.sendMail({
            from: 'dukmongonshagai@gmail.com',
            to: email,
            subject: 'Нууц үг сэргээх - Automated Billiard',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #10b981;">Automated Billiard 🎱</h2>
                        <p>Сайн байна уу, <strong>${user.name}</strong>!</p>
                        <p>Та нууц үгээ сэргээх хүсэлт илгээсэн байна.</p>
                        <p>Нууц үг сэргээх код:</p>
                        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #10b981; margin: 0; font-size: 36px; letter-spacing: 5px;">${resetOTP}</h1>
                        </div>
                        <p style="color: #666;">Энэ код 10 минутын дараа хүчингүй болно.</p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px;">Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ и-мэйлийг үл тоомсорлоно уу.</p>
                    </div>
                </div>
            `
        });

        return NextResponse.json(
            { 
                message: 'Нууц үг сэргээх код таны и-мэйл хаяг руу илгээгдлээ.',
                email: email
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { 
                message: 'Нууц үг сэргээх хүсэлт илгээхэд алдаа гарлаа',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
