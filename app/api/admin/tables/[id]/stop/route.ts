import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import Table from '@/models/table';
import Session from '@/models/session';
import { authenticateAdmin } from '@/lib/apiAuth';

// POST /api/admin/tables/[id]/stop — force stop a table session (admin only)
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = authenticateAdmin(req);
    if (auth instanceof NextResponse) return auth;

    try {
        await connectDB();
        const { id } = await params;

        const table = await Table.findById(id);
        if (!table) {
            return NextResponse.json({ message: 'Ширээ олдсонгүй' }, { status: 404 });
        }

        if (table.status !== 'PLAYING') {
            return NextResponse.json({ message: 'Энэ ширээ одоогоор тоглогдоогүй байна' }, { status: 400 });
        }

        const activeSession = await Session.findOne({ tableId: id, isActive: true });
        if (activeSession) {
            activeSession.isActive = false;
            activeSession.endTime = new Date();
            const durationMs = activeSession.endTime.getTime() - new Date(activeSession.startTime).getTime();
            const durationMin = durationMs / 60000;
            const pricePerHour = table.pricePerHour || 20000;
            activeSession.totalCost = Math.round((durationMin / 60) * pricePerHour);
            await activeSession.save();
        }

        table.status = 'AVAILABLE';
        await table.save();

        return NextResponse.json({ message: 'Ширээ амжилттай зогсоогдлоо', table, session: activeSession });
    } catch (error) {
        return NextResponse.json({ message: 'Ширээ зогсооход алдаа гарлаа' }, { status: 500 });
    }
}
