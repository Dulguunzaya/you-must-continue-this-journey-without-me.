import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import User from '@/models/user';
import { hashPassword, validatePassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { message: 'И-мэйл, OTP болон шинэ нууц үг шаардлагатай' },
                { status: 400 }
            );
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { message: passwordValidation.message },
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

        console.log('User found:', user.email);
        console.log('Reset OTP exists:', !!user.resetPasswordOTP);
        console.log('Reset OTP Expiry exists:', !!user.resetPasswordOTPExpiry);

        if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
            return NextResponse.json(
                { message: 'Нууц үг сэргээх код олдсонгүй. Эхлээд "Нууц үгээ мартсан уу?" дарж код авна уу.' },
                { status: 400 }
            );
        }

        if (user.resetPasswordOTPExpiry < new Date()) {
            return NextResponse.json(
                { message: 'OTP-ийн хугацаа дууссан байна. Дахин хүсэлт илгээнэ үү.' },
                { status: 400 }
            );
        }

        if (user.resetPasswordOTP !== otp.trim()) {
            return NextResponse.json(
                { message: 'OTP буруу байна' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpiry = undefined;
        await user.save();

        return NextResponse.json(
            { message: 'Нууц үг амжилттай солигдлоо. Одоо нэвтэрч болно.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { 
                message: 'Нууц үг солиход алдаа гарлаа',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
