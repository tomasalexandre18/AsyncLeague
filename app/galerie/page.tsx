"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Image } from '@prisma/client'
import { getGalerie } from "@/lib/getGalerie";
import NavBar from "@/app/NavBar";

export default function Gallery() {
    const router = useRouter()
    const [images, setImages] = React.useState<Image[]>([])

    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [filter, setFilter] = React.useState<string>('')

    const updateImages = async () => {
        try {
            const res = await getGalerie(filter)
            if (!res) {
                setError("Erreur lors de la récupération des images")
                return
            }
            setImages(res)
        } catch (err) {
            setError("Erreur lors de la récupération des images")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        updateImages()
    }, [filter])

    const openImage = (e: React.MouseEvent<HTMLDivElement>) => {
        router.push('/image/' + e.currentTarget.id)
    }

    return (
        <>
        <NavBar></NavBar>
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-4xl font-bold mb-4">Galerie</h1>
            <input
                type="text"
                placeholder="Rechercher une image"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-xs"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {images.map((image) => (
                    <div key={image.id} className="relative w-full h-64 cursor-pointer" onClick={openImage} id={image.id as unknown as string}>
                        <img
                            src={image.data}
                            alt={image.title}
                            className="object-cover rounded-lg shadow-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}