import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const db = new PrismaClient()

//create a watchparty.
export const POST = async (req: Request, res: Response) => {

    try {

        const body = await req.json()

        if (!(body.title || body.description || body.hostId || body.videoUrl)) {
            return NextResponse.json(
                { message: "Title,Description,Host ID and Video URL are required" },
                { status: 400 }
            )

        }

        const newWatchParty = await db.watchParty.create({
            data: {
                title: body.title,
                description: body.description || '',
                hostId: body.hostId,
                videoUrl: body.videoUrl,
                startTime: body.startTime ? new Date(body.startTime) : null,
                endTime: body.endTime ? new Date(body.endTime) : null,
            },
        });

        return NextResponse.json({ watchParty: newWatchParty, message: "WatchParty is created, Enjoy !!" }, { status: 201 });

    } catch (error) {

        console.error('Error creating watch party:', error);
        return NextResponse.json({ error: 'Failed to create watch party' }, { status: 500 });

    }
}