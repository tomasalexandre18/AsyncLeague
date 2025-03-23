import prisma from '@/lib/prisma'
import {sha256} from "js-sha256";

function generateToken() {
    // random 20 characters string
    const token = Math.random().toString(36).substring(2, 22)
    return token
}

export async function POST(request: Request) {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
        })
    }

    if (user.password !== sha256(password).toString()) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
        })
    }
    const token = generateToken()
    // create a new session
    await prisma.session.create({
        data: {
            token,
            userId: user.id,
        },
    })
    return new Response(
        JSON.stringify({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        }),
        {
            status: 200,
        }
    )
}