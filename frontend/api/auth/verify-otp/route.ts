import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import User from '@/backend/models/user';
import { generateToken } from '@/backend/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { message: 'И-мэйл болон OTP шаардлагатай' },
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

        if (!user.otp || !user.otpExpiry) {
            return NextResponse.json(
                { message: 'OTP хүчинтэй байхгүй байна. Дахин илгээнэ үү.' },
                { status: 400 }
            );
        }

        if (user.otpExpiry < new Date()) {
            return NextResponse.json(
                { message: 'OTP-ийн хугацаа дууссан байна. Дахин илгээнэ үү.' },
                { status: 400 }
            );
        }

        if (user.otp !== otp.trim()) {
            return NextResponse.json(
                { message: 'OTP буруу байна' },
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        });

        return NextResponse.json(
            { 
                message: 'И-мэйл амжилттай баталгаажлаа!',
                token,
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { 
                message: 'OTP-г баталгаажуулахад алдаа гарлаа',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}