'use server'


import prisma from "@/lib/prisma"

export async function newPostImage(token: string, image: string, title: string, description: string) {
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

    // Create new image
    const newImage = await prisma.image.create({
        data: {
            data: image,
            title,
            description,
            userId: session.user.id,
        },
    })

    return newImage
}

export async function getAllImage(token: string) {
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

    // Get all images
    const images = await prisma.image.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            user: true,
        },
    })

    return images
}