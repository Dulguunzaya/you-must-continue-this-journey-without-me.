import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './auth';

/**
 * Extract and verify JWT from Authorization header.
 * Returns the decoded payload or a 401 NextResponse.
 */
export function authenticateRequest(
    req: NextRequest
): JWTPayload | NextResponse {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
            { message: 'Нэвтрэх шаардлагатай' },
            { status: 401 }
        );
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
        return NextResponse.json(
            { message: 'Токен хүчингүй эсвэл хугацаа дууссан' },
            { status: 401 }
        );
    }

    return payload;
}

/**
 * Authenticate + verify ADMIN role.
 * Returns the decoded payload or an error NextResponse.
 */
export function authenticateAdmin(
    req: NextRequest
): JWTPayload | NextResponse {
    const result = authenticateRequest(req);

    if (result instanceof NextResponse) {
        return result;
    }

    if (result.role !== 'ADMIN') {
        return NextResponse.json(
            { message: 'Админ эрх шаардлагатай' },
            { status: 403 }
        );
    }

    return result;
}
