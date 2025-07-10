import { useState } from "react";
import { motion } from "framer-motion";
import { PiPlusCircleBold, PiTrashBold } from "react-icons/pi";
import { FaMusic } from "react-icons/fa";

type MusicaBase = {
  id: number;
  title: string;
  artist: string;
};

type Trecho = {
  id: number;
  nome: string;
  musicas: MusicaBase[];
  peso: number;
};

interface TrechoSelectorProps {
  trechos: Trecho[];
  trechoAtual: number;
  musicasSelecionadas: MusicaBase[];
  setMusicasSelecionadas: React.Dispatch<React.SetStateAction<MusicaBase[]>>;
  criarTrecho: (nome: string, musicas: MusicaBase[], peso: number) => void;
  removerTrecho: (id: number) => void;
  gerarPlaylistComTrechos: () => void;
  todasAsMusicas: MusicaBase[];
}

export default function TrechoSelector({
  trechos,
  trechoAtual,
  musicasSelecionadas,
  setMusicasSelecionadas,
  criarTrecho,
  removerTrecho,
  gerarPlaylistComTrechos,
  todasAsMusicas
}: TrechoSelectorProps) {
  const [nomeTrecho, setNomeTrecho] = useState("");
  const [pesoTrecho, setPesoTrecho] = useState(1);
  const [mostrarMusicas, setMostrarMusicas] = useState(false);

  const adicionarMusica = (musica: MusicaBase) => {
    if (!musicasSelecionadas.find(m => m.id === musica.id)) {
      setMusicasSelecionadas([...musicasSelecionadas, musica]);
    }
  };

  const removerMusica = (id: number) => {
    setMusicasSelecionadas(musicasSelecionadas.filter(m => m.id !== id));
  };

  const salvarTrecho = () => {
    if (nomeTrecho.trim() && musicasSelecionadas.length > 0) {
      criarTrecho(nomeTrecho, musicasSelecionadas, pesoTrecho);
      setNomeTrecho("");
      setPesoTrecho(1);
      setMostrarMusicas(false);
    }
  };

  return (
    <div className="flex flex-col rounded-lg bg-neutral-900 w-full overflow-auto scrollbar scrollbar-thumb-white/50 scrollbar-thumb-rounded-md">
      <div className="bg-gradient-to-b from-purple-700 to-transparent h-96 p-4 flex flex-col gap-2 justify-end min-h-[400px]">
        <span className="text-sm">Criação por Trechos</span>
        <span className="text-7xl font-bold">Trechos</span>
        <span className="text-sm text-zinc-300">Crie trechos personalizados para sua playlist</span>
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        {/* Criar novo trecho */}
        <div className="bg-neutral-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Trecho {trechoAtual}</h3>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Nome do trecho"
              value={nomeTrecho}
              onChange={(e) => setNomeTrecho(e.target.value)}
              className="flex-1 bg-neutral-700 text-white p-2 rounded-md"
            />
            <input
              type="number"
              min="1"
              max="10"
              value={pesoTrecho}
              onChange={(e) => setPesoTrecho(Number(e.target.value))}
              className="w-20 bg-neutral-700 text-white p-2 rounded-md"
              title="Peso do trecho"
            />
          </div>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setMostrarMusicas(!mostrarMusicas)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            >
              <FaMusic />
              {mostrarMusicas ? "Ocultar" : "Selecionar"} Músicas
            </button>
            
            <button
              onClick={salvarTrecho}
              disabled={!nomeTrecho.trim() || musicasSelecionadas.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              <PiPlusCircleBold />
              Criar Trecho
            </button>
          </div>

          {/* Músicas selecionadas para o trecho atual */}
          {musicasSelecionadas.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2">Músicas selecionadas ({musicasSelecionadas.length}):</h4>
              <div className="flex flex-wrap gap-2">
                {musicasSelecionadas.map(musica => (
                  <div key={musica.id} className="flex items-center gap-2 bg-neutral-700 rounded-md px-3 py-1">
                    <span className="text-sm">{musica.title}</span>
                    <button
                      onClick={() => removerMusica(musica.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lista de músicas disponíveis */}
        {mostrarMusicas && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-neutral-800 rounded-lg p-4 max-h-60 overflow-y-auto"
          >
            <h4 className="text-sm font-medium mb-2">Selecione as músicas:</h4>
            <div className="space-y-2">
              {todasAsMusicas.map(musica => (
                <div
                  key={musica.id}
                  onClick={() => adicionarMusica(musica)}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-neutral-700 ${
                    musicasSelecionadas.find(m => m.id === musica.id) ? 'bg-purple-600/30' : ''
                  }`}
                >
                  <span className="text-sm">{musica.title}</span>
                  <span className="text-xs text-zinc-400">- {musica.artist}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trechos criados */}
        {trechos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Trechos Criados ({trechos.length})</h3>
            <div className="space-y-2">
              {trechos.map(trecho => (
                <div key={trecho.id} className="flex items-center justify-between bg-neutral-800 rounded-lg p-3">
                  <div>
                    <span className="font-medium">{trecho.nome}</span>
                    <span className="text-sm text-zinc-400 ml-2">
                      ({trecho.musicas.length} músicas, peso {trecho.peso})
                    </span>
                  </div>
                  <button
                    onClick={() => removerTrecho(trecho.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <PiTrashBold />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão para gerar playlist */}
        {trechos.length > 0 && (
          <button
            onClick={gerarPlaylistComTrechos}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium"
          >
            Gerar Playlist com Trechos
          </button>
        )}
      </div>
    </div>
  );
}
