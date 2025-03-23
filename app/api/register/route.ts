import prisma from '@/lib/prisma'
import {sha256} from "js-sha256";

function generateToken() {
    // random 20 characters string
    const token = Math.random().toString(36).substring(2, 22)
    return token
}

export async function POST(request: Request) {
    const { email, password, name } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    })
    if (existingUser) {
        return new Response(JSON.stringify({ error: 'User already exists' }), {
            status: 400,
        })
    }
    // Create new user

    const user = await prisma.user.create({
        data: {
            email,
            password: sha256(password).toString(),
            name,
        },
    })

    if (!user) {
        return new Response(JSON.stringify({ error: 'User creation failed' }), {
            status: 500,
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