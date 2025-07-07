import PlaylistSelector from "./components/PlaylistSelector";
import MusicSelector from "./components/MusicSelector";
import { useEffect, useState } from "react";
import { fontes } from "./data/fontes";
import defaultCover from "./assets/Default.png"

export default function App() {

  type MusicaBase = typeof fontes.playlists[0]['songs'][0];
  type MusicaParametrizada = MusicaBase & {
    obrigatoria: boolean;
    repetir: boolean;
    peso: number;
  };

  type Playlist = {
    id: number;
    title: string;
    description: string;
    cover: string;
    songs: MusicaBase[];
  };


  const [fonte1, setFonte1] = useState<Playlist | null>(null);
  const [fonte2, setFonte2] = useState<Playlist | null>(null);
  const [AllPlaylists, setAllPlaylists] = useState(fontes.playlists);

  const [musicasParametrizadas1, setMusicasParametrizadas1] = useState<MusicaParametrizada[]>([]);
  const [musicasParametrizadas2, setMusicasParametrizadas2] = useState<MusicaParametrizada[]>([]);
  const [novaPlaylist, setNovaPlaylist] = useState<Playlist>();
  const [number, setNumber] = useState(1);

  const gerarPlaylist = () => {
    const novaMusicas = criarNovaPlaylist();

    const nova = {
      id: Date.now(),
      title: "Minha playlist"+"("+number+")",
      description: "Playlist criada automaticamente",
      cover: defaultCover,
      songs: novaMusicas
    };
    setNovaPlaylist(nova);
    AllPlaylists.push(nova);
    setFonte1(null);
    setFonte2(null);
    setNumber(number + 1);
  };

  useEffect(() => {
    if (fonte1) {
      const musicas = fonte1.songs.map(m => ({
        ...m,
        obrigatoria: false,
        repetir: false,
        peso: 1
      }));
      setMusicasParametrizadas1(musicas);
    }
  }, [fonte1]);

  useEffect(() => {
    if (fonte2) {
      const musicas = fonte2.songs.map(m => ({
        ...m,
        obrigatoria: false,
        repetir: false,
        peso: 1
      }));
      setMusicasParametrizadas2(musicas);
    }
  }, [fonte2]);

  function criarNovaPlaylist(): MusicaBase[] {
    const obrigatorias = [
      ...musicasParametrizadas1.filter(m => m.obrigatoria),
      ...musicasParametrizadas2.filter(m => m.obrigatoria),
    ];

    const opcionais = [
      ...musicasParametrizadas1.filter(m => !m.obrigatoria),
      ...musicasParametrizadas2.filter(m => !m.obrigatoria),
    ];

    // Embaralhar opcionais com base no peso
    const embaralhadas = embaralharComPeso(opcionais);

    // Combinar obrigatórias com uma quantidade limitada de opcionais
    const selecionadas = [
      ...obrigatorias,
      ...embaralhadas.slice(0, 10) // adiciona até 10 opcionais
    ];
    const repetidas = selecionadas.filter((m) => m.repetir);
    repetidas.filter((m) => m.obrigatoria).forEach((m) => selecionadas.push(m));
    repetidas.filter((m) => !m.obrigatoria).sort(() => Math.random() - 0.5).slice(0, repetidas.length/3).forEach((m) => selecionadas.push(m));
    const musicasBase: MusicaBase[] = selecionadas.map(({ obrigatoria, repetir, peso, ...musica }) => musica);

    return musicasBase;
  }

  function embaralharComPeso(musicas: MusicaParametrizada[]): MusicaParametrizada[] {
    const resultado: MusicaParametrizada[] = [];

   
    const pool: MusicaParametrizada[] = [];
    musicas.forEach(m => {
      for (let i = 0; i < m.peso; i++) {
        pool.push(m);
      }
    });


    while (pool.length > 0) {
      const index = Math.floor(Math.random() * pool.length);
      const musica = pool.splice(index, 1)[0];
      if (!resultado.includes(musica)) {
        resultado.push(musica);
      }
    }

    return resultado;
  }

  return (
    <>
      <div className="w-full h-[calc(100vh-64px)] flex flex-row gap-2">
        <PlaylistSelector fonte1={fonte1} setFonte1={setFonte1} fonte2={fonte2} setFonte2={setFonte2} AllPlaylists={AllPlaylists} gerarPlaylist={gerarPlaylist} />
        {fonte1 && <MusicSelector fonte={fonte1} musicas={musicasParametrizadas1} setMusicas={setMusicasParametrizadas1} />}
        {fonte2 && <MusicSelector fonte={fonte2} musicas={musicasParametrizadas2} setMusicas={setMusicasParametrizadas2} />}
        {novaPlaylist && !(fonte1 || fonte2) && <MusicSelector fonte={novaPlaylist} musicas={novaPlaylist.songs} setMusicas={() => { }} />}
      </div>
    </>
  )
}


