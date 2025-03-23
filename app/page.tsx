import Navbar from "@/app/NavBar";

export default function Home() {
  return (
      <>
          <Navbar></Navbar>
          <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                <video autoPlay loop muted className="w-full h-full object-cover" src={"/7670835-uhd_3840_2160_30fps_opt.mp4"}></video>
          </div>
            <main className="flex flex-col h-[calc(100vh-76px)] items-center justify-center w-full">
                <div className="flex flex-row flex-wrap gap-3 justify-center items-center w-full">
                    <h1 className="text-8xl font-bold mb-4 text-white">aSync Museum</h1>
                </div>
            </main>
          <div className={"bg-gradient-to-b from-[#05070f] to-[#0F1A2D] w-full flex flex-col items-center justify-center"}>
              <p className="text-2xl text-white mb-4 p-3">Découvrez un espace innovant où l'art et la culture deviennent accessibles à tout moment, selon votre rythme et vos envies.
              </p>
              <p className="text-2xl text-white mb-4 p-3">
                  Async Museum vous propose des expositions virtuelles interactives conçues spécialement pour une exploration libre et enrichissante, où que vous soyez.</p>


              <button className="bg-blue-500 text-white rounded-md px-4 py-2 transition-colors duration-300 hover:bg-blue-600">
                    <a href="/galerie">Visiter la galerie</a>
                </button>

          </div>
      </>
  )
}
