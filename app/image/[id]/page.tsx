"use client";

import {Image, Comment, User} from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState} from "react";
import { getImage } from "@/lib/getGalerie";
import { getComments, newComment, deleteComment} from "@/lib/comment";
import { checkToken } from "@/lib/checkToken";
import {useLocalStorage} from "@uidotdev/usehooks";
import { Prisma } from "@prisma/client";

type CommentWithUser = Prisma.CommentGetPayload<{include: {user: true}}>
export default function Page({params}: {params: Promise<{id: string}>}) {
    const router = useRouter();
    const [image, setImage] = useState<Image | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [id, setId] = useState<string>("");
    const [comments, setComments] = useState<CommentWithUser[]>([]);
    const [token, setToken] = useLocalStorage("s_token", "");
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        const fetchUser = async () => {
            const res = await checkToken(token);
            if (!res) {
                router.push("/login");
                return;
            }
            setUser(res);
        }
        fetchUser();

    }, [token]);

    useEffect(() => {
        params.then((res) => {
            setId(res.id);
        })
    }, []);
    const fetchImage = async () => {
        if (!id) {
            return;
        }
        try {
            const res = await getImage(id as string);

            if (!res) {
                setError("Erreur lors de la récupération de l'image");
                return;
            }
            setImage(res);
        } catch (err) {
            setError("Erreur lors de la récupération de l'image");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchImage();
    }, [id]);

    const fetchComments = async () => {
        if (!id) {
            return;
        }
        try {
            const res = await getComments(id as string);
            if (!res) {
                setError("Erreur lors de la récupération des commentaires");
                return;
            }
            setComments(res);
        } catch (err) {
            setError("Erreur lors de la récupération des commentaires");
        }
    }
    useEffect(() => {
        fetchComments();
    }, [id]);

    const handleNewComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const content = formData.get("content");
        if (!content) {
            setError("Veuillez remplir tous les champs");
            return;
        }
        try {
            const res = await newComment(token, id as string, content as string);
            if (!res) {
                setError("Erreur lors de l'ajout du commentaire");
                return;
            }
            setComments([...comments, res]);
        }
        catch (err) {
            setError("Erreur lors de l'ajout du commentaire");
        }
    }

    const handleDeleteComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const commentId = e.currentTarget.id;
        try {
            const res = await deleteComment(token, commentId);
            if (!res) {
                setError("Erreur lors de la suppression du commentaire");
                return;
            }
            fetchComments()
        } catch (err) {
            setError("Erreur lors de la suppression du commentaire");
        }
    }

    const handleClick = () => {
        router.push('/galerie');
    }
    if (loading) {
        return <div className="flex items-center justify-center w-full h-full">Loading...</div>;
    }


    // @ts-ignore
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-4xl font-bold mb-4">{image?.title}</h1>
            <img
                src={image?.data}
                alt={image?.title}
                className="object-cover rounded-lg shadow-lg"
            />
            <p className="text-lg mt-4">{image?.description}</p>
            <button onClick={handleClick} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Retour à la galerie</button>

            <h2 className="text-2xl font-bold mt-8">Commentaires</h2>
            <div className="flex flex-col items-center justify-center w-full flex-wrap">
                {comments.map((comment) => (
                    <div key={comment.id} className="relative cursor-pointer w-full m-5" id={comment.id as unknown as string}>
                        <div className={"flex flex-row items-center justify-between"}>
                            <h3 className="text-xl font-bold">{comment.user.name}</h3>
                            {comment.user.id === user!.id && (
                                <button id={comment.id as unknown as string} onClick={handleDeleteComment} className="bg-red-500 text-white px-2 py-1 rounded-lg">Supprimer</button>
                            )}
                        </div>
                        <p className="text-lg">{comment.content}</p>
                        <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-8">Ajouter un commentaire</h2>
            <form className="flex flex-col items-center justify-center w-full h-full" onSubmit={handleNewComment}>
                <textarea className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-xs" placeholder="Votre commentaire" name={"content"}></textarea>
                <button type="submit" className="bg-blue-500 text-white rounded-lg p-2">Ajouter</button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );

}