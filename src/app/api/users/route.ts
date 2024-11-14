import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const db = new PrismaClient()


export const POST = async (req: Request, res: Response) => {
    try {
        const body = await req.json()
        console.log(body);

        if (!body) {
            return NextResponse.json(
              { error: 'Request body is missing or invalid.' },
              { status: 400 }
            );
          }

        const user = await db.user.create({
            data: {
                username: body.username,
                email:body.email,
                password:body.password
            }
        })

        return NextResponse.json({ user }, { status: 201 })

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });

    }

}