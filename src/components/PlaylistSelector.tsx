import { useState } from "react";
import { fontes } from "../data/fontes";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { LiaPlusSolid } from "react-icons/lia";
import { PiExcludeDuotone, PiMusicNotesPlus, PiPuzzlePieceFill } from "react-icons/pi";
import CreateOption from "./CreateOption";

export default function PlaylistSelector({ fonte1, setFonte1, fonte2, setFonte2, AllPlaylists, gerarPlaylist, setCriarComTrechos}: {
    fonte1: typeof fontes.playlists[number] | null,
    setFonte1: React.Dispatch<React.SetStateAction<typeof fontes.playlists[number] | null>>,
    fonte2: typeof fontes.playlists[number] | null,
    setFonte2: React.Dispatch<React.SetStateAction<typeof fontes.playlists[number] | null>>,
    AllPlaylists: typeof fontes.playlists,
    gerarPlaylist: () => void;
    setCriarComTrechos: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const [controle, setControle] = useState(true);
    const [create, setCreate] = useState(false);
    const [choices, setChoices] = useState(false);

    const selecionarFonte = (playlist: typeof fontes.playlists[number]) => {
        if (choices) {
            // Modo de criação de playlists - permite selecionar duas
            if (fonte1?.id === playlist.id) {
                setFonte1(null);
            } else if (fonte2?.id === playlist.id) {
                setFonte2(null);
            } else if (!fonte1) {
                setFonte1(playlist);
            } else if (!fonte2) {
                setFonte2(playlist);
            } else if (controle) {
                setFonte1(playlist);
                setControle(false);
            } else {
                setFonte2(playlist);
                setControle(true);
            }
        } else {
            // Modo normal - permite selecionar apenas uma
            if (fonte1?.id === playlist.id) {
                setFonte1(null);
            } else {
                setFonte1(playlist);
                setFonte2(null); // Limpa a segunda fonte
            }
        }
    };

    
    const Gerar = () => {
        setChoices(false);
        setCreate(false);
        gerarPlaylist();
    }

    return (
        <div className="pl-3 pt-3 pr-1 bg-neutral-900 rounded-lg ml-2 flex flex-col w-[400px] min-w-[300px] h-full place-content-between">
            <div>
                <div className="flex flex-row gap-4 px-2 justify-between align-bottom items-center mb-4">
                    <span className="text-md font-medium select-none">{choices ? "Selecione as Playlists" : "Sua Biblioteca"}</span>
                    {!choices && <div title="Criar uma Playlist" onClick={() => setCreate(!create)} className="flex flex-row gap-2 items-center rounded-full bg-neutral-500/10 px-4 py-2 hover:cursor-pointer relative">
                        {create ? <motion.div animate={{ rotate: 45 }} transition={{ duration: 0.2 }}><LiaPlusSolid className="size-5 fill-neutral-200" /></motion.div> : <motion.div animate={{ rotate: 0 }} transition={{ duration: 0.2 }}><LiaPlusSolid className="size-5 fill-neutral-200" /></motion.div>}
                        <span className="text-sm font-bold select-none">Criar</span>
                        {create && <div className="flex flex-col absolute top-12 left-0 bg-neutral-800 rounded-md shadow-xl/20 z-50 p-1 w-96">
                            <CreateOption titulo="Playlist" description="Crie uma playlist com músicas ou episódios" icon={PiMusicNotesPlus}></CreateOption>
                            <div className="h-[1px] bg-zinc-600 m-2"></div>
                            <CreateOption onClick={() => setChoices(true)} titulo="Playlist Mixer" description="Criação automática e randomizada de playlist" icon={PiExcludeDuotone}></CreateOption>
                            <div className="h-[1px] bg-zinc-600 m-2"></div>
                            <CreateOption onClick={() => setCriarComTrechos(true)} titulo="Playlist por Trechos" description="Crie playlist selecionando trechos específicos" icon={PiPuzzlePieceFill}></CreateOption>
                        </div>}
                    </div>}
                </div>
                <div className="flex flex-col overflow-y-auto">
                    {AllPlaylists.map(playlist => (
                        <div key={playlist.id} className="flex flex-row p-2
                     gap-4 rounded-lg hover:bg-zinc-800 hover:cursor-pointer relative" onClick={() => selecionarFonte(playlist)}>

                            <img src={playlist.cover} alt={playlist.title} className="size-12 rounded-md shadow-md select-none" />

                            <div className="flex flex-col justify-center w-2/3">
                                <span className="text-l font-medium truncate select-none">{playlist.title}</span>
                                <span className="text-sm text-zinc-400 truncate select-none">{playlist.description}</span>
                            </div>

                            {(fonte1?.id === playlist.id || fonte2?.id === playlist.id) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="rounded-full absolute top-0 left-0 size-6 bg-green-500 shadow-lg"
                                >
                                    <FaCheck className="text-md text-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </motion.div>)}
                        </div>
                    ))}

                </div>
            </div>

            {choices && <div className={fonte1 && fonte2 ? "flex w-[97%] h-12 rounded-md justify-center items-center bg-neutral-500 my-4 cursor-pointer hover:bg-neutral-600" : "flex w-[97%] h-12 rounded-md justify-center items-center bg-neutral-500 my-4"} onClick={Gerar}>
                <span className="text-md text-white select-none">
                    {(fonte1 && fonte2) ? "Gerar Nova Playlist" : (fonte1 || fonte2) ? "Selecione mais uma playlist" : "Selecione as playlists"}
                </span>
            </div>}
        </div>
    );
}