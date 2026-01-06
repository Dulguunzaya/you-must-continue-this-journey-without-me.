import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import User from '@/models/user';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        
        const { email, otp } = await req.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: 'Хэрэглэгч олдсонгүй' },
                { status: 400 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: 'Хэрэглэгч аль хэдийн баталгаажсан байна' },
                { status: 400 }
            );
        }

        if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return NextResponse.json(
                { message: 'OTP буруу эсвэл хугацаа нь дууссан байна' },
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return NextResponse.json(
            { message: 'И-мэйл амжилттай баталгаажлаа. Одоо нэвтэрч болно.' },
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
