import PlaylistSelector from "./components/PlaylistSelector";
import MusicSelector from "./components/MusicSelector";
import TrechoSelector from "./components/TrechoSelector";
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

  type Trecho = {
    id: number;
    nome: string;
    musicas: MusicaBase[];
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
  const [musicasNovaPlaylist, setMusicasNovaPlaylist] = useState<MusicaParametrizada[]>([]);
  const [novaPlaylist, setNovaPlaylist] = useState<Playlist>();
  const [number, setNumber] = useState(1);
  
  // Estados para gerenciar trechos
  const [trechos, setTrechos] = useState<Trecho[]>([]);
  const [trechoAtual, setTrechoAtual] = useState<number>(1);
  const [musicasSelecionadas, setMusicasSelecionadas] = useState<MusicaBase[]>([]);
  const [criarComTrechos, setCriarComTrechos] = useState<boolean>(false);

  // Todas as músicas disponíveis de todas as playlists
  const todasAsMusicas = AllPlaylists.flatMap(playlist => playlist.songs);

  const gerarPlaylist = () => {
    const novaMusicas = criarNovaPlaylist();

    const nova = {
      id: Date.now(),
      title: "Minha playlist"+"("+number+")",
      description: "Playlist criada automaticamente",
      cover: defaultCover,
      songs: novaMusicas
    };
    
    // Limpa tudo antes de definir a nova playlist
    setFonte1(null);
    setFonte2(null);
    setMusicasParametrizadas1([]);
    setMusicasParametrizadas2([]);
    
    // Cria as músicas parametrizadas para a nova playlist
    const musicasParametrizadasNova = novaMusicas.map(m => ({
      ...m,
      obrigatoria: false,
      repetir: false,
      peso: 1
    }));
    
    setMusicasNovaPlaylist(musicasParametrizadasNova);
    setNovaPlaylist(nova);
    setAllPlaylists([...AllPlaylists, nova]);
    setNumber(number + 1);
  };

  useEffect(() => {
    if (fonte1) {
      console.log('Fonte1 selecionada:', fonte1.title);
      const musicas = fonte1.songs.map(m => ({
        ...m,
        obrigatoria: false,
        repetir: false,
        peso: 1
      }));
      setMusicasParametrizadas1(musicas);
    } else {
      console.log('Fonte1 desmarcada');
      setMusicasParametrizadas1([]);
    }
  }, [fonte1]);

  useEffect(() => {
    if (fonte2) {
      console.log('Fonte2 selecionada:', fonte2.title);
      const musicas = fonte2.songs.map(m => ({
        ...m,
        obrigatoria: false,
        repetir: false,
        peso: 1
      }));
      setMusicasParametrizadas2(musicas);
    } else {
      console.log('Fonte2 desmarcada');
      setMusicasParametrizadas2([]);
    }
  }, [fonte2]);

  // UseEffect para garantir limpeza correta da nova playlist
  useEffect(() => {
    if ((fonte1 || fonte2) && novaPlaylist) {
      console.log('Limpando nova playlist devido a seleção de fonte');
      setNovaPlaylist(undefined);
      setMusicasNovaPlaylist([]);
    }
  }, [fonte1, fonte2, novaPlaylist]);

  // UseEffect para limpar modo de trechos quando necessário
  useEffect(() => {
    if (criarComTrechos && (fonte1 || fonte2)) {
      setCriarComTrechos(false);
    }
  }, [fonte1, fonte2, criarComTrechos]);

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

  // Funções para gerenciar trechos
  const criarTrecho = (nome: string, musicas: MusicaBase[], peso: number) => {
    const novoTrecho: Trecho = {
      id: Date.now(),
      nome,
      musicas,
      peso
    };
    setTrechos([...trechos, novoTrecho]);
    setMusicasSelecionadas([]);
    setTrechoAtual(trechoAtual + 1);
  };

  const removerTrecho = (id: number) => {
    setTrechos(trechos.filter(t => t.id !== id));
  };

  const gerarPlaylistComTrechos = () => {
    const musicasDosTrechos: MusicaBase[] = [];
    
    // Contar total de músicas de todos os trechos
    const totalMusicas = trechos.reduce((total, trecho) => total + trecho.musicas.length, 0);
    
    if (totalMusicas <= 10) {
      // Se o total não passa de 10, inclui todas as músicas de todos os trechos
      trechos.forEach(trecho => {
        musicasDosTrechos.push(...trecho.musicas);
      });
    } else {
      // Se passa de 10, usa lógica de peso para otimizar a seleção
      const musicasComPeso: { musica: MusicaBase; peso: number; trechoId: number }[] = [];
      
      // Criar array de músicas com seus respectivos pesos
      trechos.forEach(trecho => {
        trecho.musicas.forEach(musica => {
          musicasComPeso.push({
            musica,
            peso: trecho.peso,
            trechoId: trecho.id
          });
        });
      });
      
      // Criar pool baseado no peso (música com peso maior aparece mais vezes)
      const pool: { musica: MusicaBase; trechoId: number }[] = [];
      musicasComPeso.forEach(item => {
        for (let i = 0; i < item.peso; i++) {
          pool.push({ musica: item.musica, trechoId: item.trechoId });
        }
      });
      
      // Embaralhar o pool
      const poolEmbaralhado = pool.sort(() => Math.random() - 0.5);
      
      // Selecionar até 10 músicas únicas, priorizando diversidade de trechos
      const musicasAdicionadas = new Set<number>();
      const trechosUsados = new Map<number, number>(); // trechoId -> quantidade de músicas
      
      for (const item of poolEmbaralhado) {
        if (musicasDosTrechos.length >= 10) break;
        
        // Evitar músicas duplicadas
        if (musicasAdicionadas.has(item.musica.id)) continue;
        
        // Tentar manter diversidade: limite de 3 músicas por trecho inicialmente
        const musicasDoTrecho = trechosUsados.get(item.trechoId) || 0;
        if (musicasDoTrecho >= 3 && musicasDosTrechos.length < 8) continue;
        
        musicasDosTrechos.push(item.musica);
        musicasAdicionadas.add(item.musica.id);
        trechosUsados.set(item.trechoId, musicasDoTrecho + 1);
      }
      
      // Se ainda não temos 10 músicas, relaxar a restrição de diversidade
      if (musicasDosTrechos.length < 10) {
        for (const item of poolEmbaralhado) {
          if (musicasDosTrechos.length >= 10) break;
          
          if (!musicasAdicionadas.has(item.musica.id)) {
            musicasDosTrechos.push(item.musica);
            musicasAdicionadas.add(item.musica.id);
          }
        }
      }
    }

    // Criar a nova playlist
    const nova: Playlist = {
      id: Date.now(),
      title: "Playlist por Trechos (" + number + ")",
      description: `Playlist criada com trechos personalizados (${musicasDosTrechos.length} músicas)`,
      cover: defaultCover,
      songs: musicasDosTrechos
    };

    // Limpar estados
    setFonte1(null);
    setFonte2(null);
    setMusicasParametrizadas1([]);
    setMusicasParametrizadas2([]);
    setTrechos([]);
    setTrechoAtual(1);
    setCriarComTrechos(false);
    
    // Definir nova playlist
    const musicasParametrizadasNova = musicasDosTrechos.map(m => ({
      ...m,
      obrigatoria: false,
      repetir: false,
      peso: 1
    }));
    
    setMusicasNovaPlaylist(musicasParametrizadasNova);
    setNovaPlaylist(nova);
    setAllPlaylists([...AllPlaylists, nova]);
    setNumber(number + 1);
  };

  return (
    <>
      <div className="w-full h-[calc(100vh-64px)] flex flex-row gap-2">
        <PlaylistSelector fonte1={fonte1} setFonte1={setFonte1} fonte2={fonte2} setFonte2={setFonte2} AllPlaylists={AllPlaylists} gerarPlaylist={gerarPlaylist} setCriarComTrechos={setCriarComTrechos} />
        
        {criarComTrechos && (
          <TrechoSelector 
            trechos={trechos}
            trechoAtual={trechoAtual}
            musicasSelecionadas={musicasSelecionadas}
            setMusicasSelecionadas={setMusicasSelecionadas}
            criarTrecho={criarTrecho}
            removerTrecho={removerTrecho}
            gerarPlaylistComTrechos={gerarPlaylistComTrechos}
            todasAsMusicas={todasAsMusicas}
          />
        )}
        
        {!criarComTrechos && fonte1 && <MusicSelector key={`fonte1-${fonte1.id}-${Date.now()}`} fonte={fonte1} musicas={musicasParametrizadas1} setMusicas={setMusicasParametrizadas1} />}
        {!criarComTrechos && fonte2 && <MusicSelector key={`fonte2-${fonte2.id}-${Date.now()}`} fonte={fonte2} musicas={musicasParametrizadas2} setMusicas={setMusicasParametrizadas2} />}
        {!criarComTrechos && novaPlaylist && !(fonte1 || fonte2) && musicasNovaPlaylist.length > 0 && <MusicSelector key={`nova-${novaPlaylist.id}-${Date.now()}`} fonte={novaPlaylist} musicas={musicasNovaPlaylist} setMusicas={() => { }} />}
      </div>
    </>
  )
}


