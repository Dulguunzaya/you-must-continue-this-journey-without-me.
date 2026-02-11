import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import Session from '@/models/session';
import Table from '@/models/table';
import { authenticateRequest } from '@/lib/apiAuth';

// POST /api/user/sessions/stop — stop current user's active session
export async function POST(req: NextRequest) {
    const auth = authenticateRequest(req);
    if (auth instanceof NextResponse) return auth;

    try {
        await connectDB();

        const activeSession = await Session.findOne({
            userId: auth.userId,
            isActive: true
        }).populate('tableId');

        if (!activeSession) {
            return NextResponse.json({ message: 'Идэвхтэй тоглолт олдсонгүй' }, { status: 404 });
        }

        const table = await Table.findById(activeSession.tableId._id || activeSession.tableId);

        activeSession.isActive = false;
        activeSession.endTime = new Date();
        const durationMs = activeSession.endTime.getTime() - new Date(activeSession.startTime).getTime();
        const durationMin = durationMs / 60000;
        const pricePerHour = table?.pricePerHour || 20000;
        activeSession.totalCost = Math.round((durationMin / 60) * pricePerHour);
        await activeSession.save();

        if (table) {
            table.status = 'AVAILABLE';
            await table.save();
        }

        return NextResponse.json({
            message: 'Тоглолт амжилттай зогсоогдлоо',
            session: activeSession
        });
    } catch (error) {
        return NextResponse.json({ message: 'Тоглолт зогсооход алдаа гарлаа' }, { status: 500 });
    }
}
