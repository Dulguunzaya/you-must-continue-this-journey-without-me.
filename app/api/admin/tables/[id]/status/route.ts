import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import Table from '@/models/table';
import { authenticateAdmin } from '@/lib/apiAuth';

// PATCH /api/admin/tables/[id]/status — toggle AVAILABLE / DISABLED (admin only)
export async function PATCH(
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

        if (table.status === 'PLAYING') {
            return NextResponse.json(
                { message: 'Тоглож байгаа ширээний төлөв өөрчлөх боломжгүй' },
                { status: 400 }
            );
        }

        table.status = table.status === 'AVAILABLE' ? 'DISABLED' : 'AVAILABLE';
        await table.save();

        return NextResponse.json(table);
    } catch (error) {
        return NextResponse.json({ message: 'Төлөв өөрчлөхөд алдаа гарлаа' }, { status: 500 });
    }
}
