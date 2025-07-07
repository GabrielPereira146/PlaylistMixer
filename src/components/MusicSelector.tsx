
import { FaRepeat } from "react-icons/fa6";
import { fontes } from "../data/fontes";
import { PiCheckCircleBold, PiPlusCircleBold } from "react-icons/pi";
import { motion } from "framer-motion";


  type MusicaBase = typeof fontes.playlists[0]['songs'][0];
  type MusicaParametrizada = MusicaBase & {
    obrigatoria: boolean;
    repetir: boolean;
    peso: number;
  };

export default function MusicSelector({musicas, setMusicas, fonte}:{
    musicas: MusicaParametrizada[] | null,
    setMusicas: React.Dispatch<React.SetStateAction<MusicaParametrizada[]>>,
    fonte: typeof fontes.playlists[number] | null
}) {


    
    return (
        <div className="flex flex-col rounded-lg bg-neutral-900 w-full overflow-auto scrollbar scrollbar-thumb-white/50  scrollbar-thumb-rounded-md">
            <div className="bg-gradient-to-b from-gray-700 to-transparent h-96 p-4 flex flex-col gap-2 justify-end min-h-[400px]">
                <span className="text-sm">Playlist</span>
                <span className="text-7xl font-bold">{fonte?.title}</span>
                <span className="text-sm text-zinc-300">{fonte?.description}</span>
                <span className="text-sm text-zinc-300">{fonte?.songs.length} músicas</span>
            </div>
            <div className="p-4 flex flex-col">
                <div className="flex gap-4 flex-row py-2 px-7 items-center">
                        <span className="text-zinc-400">#</span>
                        <span className="text-sm text-zinc-400">Titulo</span>
                </div>
                <hr className="w-full border-zinc-700 pb-3"/>
                {musicas?.map(musica => (
                    <div key={musica.id} className="flex gap-4 flex-row py-2 px-7 items-center rounded-md hover:bg-neutral-800 ">
                        <span className="text-zinc-400">{musica.id}</span>
                        <div className="flex flex-col">
                            <span className="text-sm hover:underline hover:cursor-pointer">{musica.title}</span>
                            <span className="text-sm text-zinc-400">{musica.artist}</span>
                        </div>

                        <div className="flex gap-2 ml-auto">
                            {!musica.obrigatoria && <input type="text" min="1" value={musica.peso} onChange={e => setMusicas(musicas.map(m => m.id === musica.id ? {...m, peso: Number(e.target.value)} : m))} className="bg-neutral-800 border-none text-zinc-400 py-1 px-2 w-[50px] rounded-md select-none"/>}
                            <button onClick={() => setMusicas(musicas.map(m => m.id === musica.id ? {...m, obrigatoria: !m.obrigatoria} : m))} title="Obrigatória" className="text-zinc-400 hover:text-zinc-300 hover:cursor-pointer hover:">
                                {musica.obrigatoria ? <motion.div animate={{rotate: 360}} transition={{duration: 0.5}}><PiCheckCircleBold className="fill-green-600 size-6"/></motion.div>: <PiPlusCircleBold  className="size-6"/>}
                            </button>
                            <button onClick={() => setMusicas(musicas.map(m => m.id === musica.id ? {...m, repetir: !m.repetir} : m))} title="Repetir" className="text-zinc-400 hover:text-zinc-300 hover:cursor-pointer">
                                {musica.repetir ? <FaRepeat className="fill-green-600" /> : <FaRepeat />}
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}