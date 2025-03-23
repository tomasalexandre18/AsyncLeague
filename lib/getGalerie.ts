"use server";

import prisma from "@/lib/prisma"

export async function getGalerie(filter: string) {
    // Get all images
    const images = await prisma.image.findMany({
        where: {
            title : {
                contains: filter ? filter : undefined,
            }
        },
    })

    return images
}

export async function getImage(id: string) {
    // Get image by id
    const image = await prisma.image.findUnique({
        where: {
            id: Number(id),
        },
    })

    return image
}