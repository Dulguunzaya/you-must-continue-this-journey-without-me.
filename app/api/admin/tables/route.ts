import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/db';
import Table, { FIXED_PRICE_PER_HOUR } from '@/models/table';
import { authenticateAdmin } from '@/lib/apiAuth';

// GET /api/admin/tables — list all tables (admin only)
export async function GET(req: NextRequest) {
    const auth = authenticateAdmin(req);
    if (auth instanceof NextResponse) return auth;

    try {
        await connectDB();
        const tables = await Table.find().sort({ name: 1 });
        return NextResponse.json(tables);
    } catch (error) {
        return NextResponse.json(
            { message: 'Ширээнүүдийг авахад алдаа гарлаа' },
            { status: 500 }
        );
    }
}

// POST /api/admin/tables — create a new table (admin only)
// Price is ALWAYS fixed at 20,000₮/hour — any incoming price is ignored
export async function POST(req: NextRequest) {
    const auth = authenticateAdmin(req);
    if (auth instanceof NextResponse) return auth;

    try {
        await connectDB();
        const { name } = await req.json();

        if (!name || !name.trim()) {
            return NextResponse.json(
                { message: 'Ширээний нэр шаардлагатай' },
                { status: 400 }
            );
        }

        const existing = await Table.findOne({ name: name.trim() });
        if (existing) {
            return NextResponse.json(
                { message: 'Энэ нэртэй ширээ аль хэдийн байна' },
                { status: 409 }
            );
        }

        const table = await Table.create({
            name: name.trim(),
            pricePerHour: FIXED_PRICE_PER_HOUR
        });
        return NextResponse.json(table, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Ширээ үүсгэхэд алдаа гарлаа' },
            { status: 500 }
        );
    }
}
