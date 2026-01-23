import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import User from '@/models/user';
import { comparePassword, generateToken, validateEmail } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'И-мэйл болон нууц үг шаардлагатай' },
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
                { message: 'И-мэйл эсвэл нууц үг буруу байна' },
                { status: 401 }
            );
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'И-мэйл эсвэл нууц үг буруу байна' },
                { status: 401 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { message: 'И-мэйл баталгаажаагүй байна. OTP-г баталгаажуулна уу.', needsVerification: true, email: user.email },
                { status: 403 }
            );
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        });

        return NextResponse.json(
            { 
                message: 'Амжилттай нэвтэрлээ', 
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