"use client";
import dynamic from 'next/dynamic'
import { useLocalStorage } from '@uidotdev/usehooks';
import Link from 'next/link';


function Navbar() {
    const [value, setValue] = useLocalStorage('s_token', '');
    const logout = () => {
        setValue('')
    }

    return (
        <nav className="w-full text-[#FAFAFA] py-4 flex items-center justify-center">
            <div className="flex justify-center gap-10 text-xl">
                <Link href="/" className="hover:bg-[#183153] hover:text-[#FAFAFA] text-white rounded-md px-4 py-2 transition-colors duration-300 bg-blue-500 p-4 shadow-lg">
                    Accueil
                </Link>
                <Link href={"/galerie"} className="hover:bg-[#183153] hover:text-[#FAFAFA] text-white rounded-md px-4 py-2 transition-colors duration-300 bg-blue-500 p-4 shadow-lg">
                    Galerie
                </Link>

                {value && (<>
                    <Link href="/account" className="hover:bg-[#183153] hover:text-[#FAFAFA] text-white rounded-md px-4 py-2 transition-colors duration-300 bg-blue-500 p-4 shadow-lg">
                        Mon compte
                    </Link>
                    <Link onClick={logout} href={"/"} className="hover:bg-[#183153] hover:text-[#FAFAFA] text-white rounded-md px-4 py-2 transition-colors duration-300 bg-blue-500 p-4 shadow-lg">
                        Se déconnecter
                    </Link>
                    </>
                )}
                {!value && (<>
                    <Link href="/login" className="hover:bg-[#183153] hover:text-[#FAFAFA] text-white rounded-md px-4 py-2 transition-colors duration-300 bg-green-700 p-4 shadow-lg">
                        Se connecter
                    </Link>
                    <Link href="/register" className="hover:bg-[#183153] hover:text-[#FAFAFA] text-white rounded-md px-4 py-2 transition-colors duration-300 bg-green-700 p-4 shadow-lg">
                        S'inscrire
                    </Link>
                </>)}
            </div>
        </nav>
    );
}


export default dynamic(() => Promise.resolve(Navbar), {
    ssr: false,
});