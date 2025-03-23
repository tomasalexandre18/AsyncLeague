"use server"
import prisma from "@/lib/prisma"

export async function checkToken(token: string) {
    // Check if token is valid
    const session = await prisma.session.findUnique({
        where: {
            token,
        },
        include: {
            user: true,
        },
    })
    if (!session) {
        return null
    }
    return session.user
}