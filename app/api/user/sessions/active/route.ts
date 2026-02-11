import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import Session from '@/models/session';
import Table from '@/models/table';
import { authenticateRequest } from '@/lib/apiAuth';

// GET /api/user/sessions/active — get current user's active session
export async function GET(req: NextRequest) {
    const auth = authenticateRequest(req);
    if (auth instanceof NextResponse) return auth;

    try {
        await connectDB();

        const activeSession = await Session.findOne({
            userId: auth.userId,
            isActive: true
        }).populate('tableId');

        if (!activeSession) {
            return NextResponse.json({ session: null });
        }

        const table = activeSession.tableId as any;
        const durationMs = Date.now() - new Date(activeSession.startTime).getTime();
        const durationInMinutes = Math.round(durationMs / 60000);
        const pricePerHour = table?.pricePerHour || 20000;
        const currentCost = Math.round((durationInMinutes / 60) * pricePerHour);

        return NextResponse.json({
            session: {
                _id: activeSession._id,
                tableId: table,
                startTime: activeSession.startTime,
                durationInMinutes,
                currentCost
            }
        });
    } catch (error) {
        return NextResponse.json({ message: 'Идэвхтэй тоглолт авахад алдаа гарлаа' }, { status: 500 });
    }
}
