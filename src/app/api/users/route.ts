import { PrismaClient } from '@prisma/client';
import { useParams } from 'next/navigation';
import { NextResponse } from 'next/server';
import bcrypt from "bcrypt";
const db = new PrismaClient()

//below POST and GET are for register and login controller.
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

        const hashedPassword = await bcrypt.hash(body.password, 10)

        const user = await db.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: hashedPassword
            }
        })

        return NextResponse.json({ user }, { status: 201 })

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });

    }

}

export const GET = async (req: Request, res: Response) => {
    try {
        const { email, password } = await req.json()
        // const id = useParams()
    
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and Password is required' },
                { status: 400 }
            );
        }
    
        const existingUser = await db.user.findUnique({
            where: {email}
        })
    
        if (!existingUser || !existingUser.password) {
            return NextResponse.json(
                { error: "User does not exist or invalid credentials." },
                { status: 401 }
            )
        }
    
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Password is incorrect' },
                { status: 401 }
            );
        }

        return NextResponse.json({ message: 'Login successful', user: existingUser }, { status: 200 });

    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
        
    }


}