import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import Table from '@/models/table';
import Session from '@/models/session';
import { authenticateRequest } from '@/lib/apiAuth';

// POST /api/user/tables/[tableId]/book — book a table
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ tableId: string }> }
) {
    const auth = authenticateRequest(req);
    if (auth instanceof NextResponse) return auth;

    try {
        await connectDB();
        const { tableId } = await params;

        const table = await Table.findById(tableId);
        if (!table) {
            return NextResponse.json({ message: 'Ширээ олдсонгүй' }, { status: 404 });
        }

        if (table.status !== 'AVAILABLE') {
            return NextResponse.json({ message: 'Ширээ боломжгүй байна' }, { status: 400 });
        }

        // Check if user already has an active session
        const existingSession = await Session.findOne({ userId: auth.userId, isActive: true });
        if (existingSession) {
            return NextResponse.json(
                { message: 'Танд аль хэдийн идэвхтэй тоглолт байна' },
                { status: 400 }
            );
        }

        const session = await Session.create({
            userId: auth.userId,
            tableId,
            startTime: new Date(),
            isActive: true
        });

        table.status = 'PLAYING';
        await table.save();

        return NextResponse.json(
            { message: 'Ширээ амжилттай захиалагдлаа', session, table },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: 'Ширээ захиалахад алдаа гарлаа' }, { status: 500 });
    }
}
