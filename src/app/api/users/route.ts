import { PrismaClient } from '@prisma/client';
import { useParams } from 'next/navigation';
import { NextResponse } from 'next/server';
import { hashPassword, verifyPassword } from '@/lib/hash';
import { generateToken } from '@/lib/auth';
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

        const hashedPassword = await hashPassword(body.pasword)

        const user = await db.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: body.hashedPassword
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
    
        const user = await db.user.findUnique({
            where: {email}
        })
    
        if (!user) {
            return NextResponse.json(
                { error: "User does not exist or invalid credentials." },
                { status: 401 }
            )
        }
    
        
        const isPasswordValid = await verifyPassword(password, user.password)
        
        
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Password is incorrect' },
                { status: 401 }
            );
        }

        //for generating token 

        const token = generateToken(user.id)

        const response=  NextResponse.json({ message: 'Login successful', user }, { status: 200 });

        return response.cookies.set('authToken', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 30*30
        
        } )


    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
        
    }


}

//logout user

export const logout = async() =>  {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('authToken', '', { maxAge: 0, path: '/' });
    return response;
  }