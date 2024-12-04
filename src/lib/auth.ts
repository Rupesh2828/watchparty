import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET_TOKEN || ''

export const generateToken = (userId: number) => {
    return jwt.sign({ id: userId }, SECRET, { expiresIn: '30mins' })
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET)
    } catch (error) {
        throw new Error("Token is invalid or either expired.")
    }
}


export const requireAuth = (req: Request) => {

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        return verifyToken(token);
    } catch {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

}