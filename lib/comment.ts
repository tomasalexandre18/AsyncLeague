"use server"

import prisma from "@/lib/prisma"
import { Comment } from "@prisma/client"
import { NextResponse } from "next/server"

export async function getComments(id: string) {
    // Get all comments
    const comments = await prisma.comment.findMany({
        where: {
            imageId: Number(id),
        },
        include: {
            user: true,
        },
    })

    return comments
}


export async function newComment(token: string, id: string, comment: string) {
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

    // Create new comment
    const newComment = await prisma.comment.create({
        data: {
            content: comment,
            imageId: Number(id),
            userId: session.user.id,
        },
        include: {
            user: true,
        },
    })

    return newComment
}


export async function deleteComment(token: string, id: string) {
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

    // Delete comment
    const deleteComment = await prisma.comment.delete({
        where: {
            id: Number(id),
            userId: session.user.id,
        },
    })

    return deleteComment
}