import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import User from '@/models/user';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        
        const { email, password } = await req.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: 'Хэрэглэгч олдсонгүй' },
                { status: 400 }
            );
        }

        if (user.password !== password) {
            return NextResponse.json(
                { message: 'Нууц үг буруу байна' },
                { status: 400 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { message: 'И-мэйл баталгаажаагүй байна. OTP-г баталгаажуулна уу.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Нэвтэрсэн', user: { id: user._id, email: user.email, name: user.name } },
            { status: 200 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { 
                message: 'Нэвтэрхэд алдаа гарлаа',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
