import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import Table from '@/models/table';
import { authenticateRequest } from '@/lib/apiAuth';

// GET /api/user/tables/available — list available tables (authenticated users)
export async function GET(req: NextRequest) {
    const auth = authenticateRequest(req);
    if (auth instanceof NextResponse) return auth;

    try {
        await connectDB();
        const tables = await Table.find({ status: 'AVAILABLE' }).sort({ name: 1 });
        return NextResponse.json(tables);
    } catch (error) {
        return NextResponse.json(
            { message: 'Ширээнүүдийг авахад алдаа гарлаа' },
            { status: 500 }
        );
    }
}
