"use client"
import {useLocalStorage} from "@uidotdev/usehooks";
import {useRouter} from "next/navigation";
import {checkToken} from "@/lib/checkToken";
import {useEffect, useState} from "react";
import {User, Image, Prisma} from "@prisma/client";
import dynamic from "next/dynamic";
import {newPostImage, getAllImage} from "@/lib/newPostImage";

type ImageWithUser = Prisma.ImageGetPayload<{include: {user: true}}>
function Account() {
    const [token, setToken] = useLocalStorage('s_token', '');
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null);
    const [images, setImages] = useState<ImageWithUser[]>([]);

    useEffect(() => {
        checkToken(token).then(response => {
            if (response) {
                setUser(response)
            } else {
                router.push('/login')
            }
        }).catch(err => {
            console.error(err)
            router.push('/login')
        })
    }, [token, router])

    const updateImages = async () => {
        const res = await getAllImage(token)
        if (!res) {
            alert("Erreur lors de la récupération des images")
            return
        }
        setImages(res)
    }

    useEffect(() => {
        updateImages()
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const image = formData.get("image")
        const title = formData.get("title")
        const description = formData.get("description")
        // check if image is valid
        if (image && !(image instanceof File)) {
            alert("Veuillez sélectionner une image valide")
            return
        }

        if (!image || !title || !description) {
            alert("Veuillez remplir tous les champs")
            return
        }

        // convert image to base64 url
        const reader = new FileReader();
        reader.readAsDataURL(image as Blob);
        reader.onloadend = async () => {
            const base64data = reader.result as string;
            try {
                const res = await newPostImage(token, base64data, title as string, description as string)
                if (!res) {
                    throw new Error("Erreur lors de l'ajout de l'image")
                }
                alert("Image ajoutée avec succès")
                updateImages()
            } catch (err) {
                console.error(err)
                alert("Erreur lors de l'ajout de l'image")
            }
        }

    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-4xl font-bold mb-4">Mon compte</h1>
            <p className="text-xl">Bienvenue sur votre compte !</p>
            <p className="text-xl">Vous pouvez gérer vos informations ici.</p>

            <div className={"flex flex-col items-center justify-center w-[400px] h-full flex-wrap"}>
                <h1 className="text-4xl font-bold mb-4">Ajouter une image</h1>
                <form onSubmit={handleSubmit}>
                    <input type="file" name="image" accept="image/*" className={"bg-gray-200 rounded-lg p-2 mb-4 w-full max-w-xs"} />
                    <input type="text" name="title" placeholder="Titre" className={"bg-gray-200 rounded-lg p-2 mb-4 w-full max-w-xs"} />
                    <input type="text" name="description" placeholder="Description" className={"bg-gray-200 rounded-lg p-2 mb-4 w-full max-w-xs"} />
                    <button type={"submit"} className={"bg-blue-500 text-white rounded-lg p-2 mb-4 w-full max-w-xs"}>
                        Ajouter
                    </button>
                </form>
            </div>

            <div className={"flex flex-col items-center justify-center w-full h-full flex-wrap"}>
                <h1 className="text-4xl font-bold mb-4">Mes images</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {images.map((image) => (
                        <div key={image.id} className="relative w-full h-64 cursor-pointer" onClick={() => router.push('/image/' + image.id)}>
                            <img
                                src={image.data}
                                alt={image.title}
                                className="object-cover rounded-lg shadow-lg"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                                <h3 className="text-xl font-bold">{image.title}</h3>
                                <p className="text-sm">{image.description}</p>
                                <p className="text-sm">{new Date(image.createdAt).toLocaleString()}</p>
                                <button className="bg-red-500 text-white px-2 py-1 rounded-lg mt-2" onClick={(e) => {
                                    e.stopPropagation()
                                    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette image ?")
                                    if (confirmDelete) {
                                        alert("Non implémenté")
                                    }
                                }
                                }>Supprimer</button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
    // const [value, setValue] = useLocalStorage('s_token', '');
}
export default dynamic(() => Promise.resolve(Account), {
    ssr: false,
});