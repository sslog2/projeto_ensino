import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Flag, Star, Box, ChevronRight, LayoutGrid, Settings2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export function CriarDesafio() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [pontos, setPontos] = useState(100);

  // Estados do tabuleiro
  const [gridSize, setGridSize] = useState(5);
  const [robotStart, setRobotStart] = useState(0);
  const [goalPos, setGoalPos] = useState(24);
  const [obstacles, setObstacles] = useState<number[]>([]);
  const [stars, setStars] = useState<number[]>([]);
  
  // Modo de seleção
  const [mode, setMode] = useState<'robot' | 'goal' | 'obstacle' | 'star'>('obstacle');

  // Restrições (Regras)
  const [limiteMover, setLimiteMover] = useState<number | ''>('');
  const [limiteVirar, setLimiteVirar] = useState<number | ''>('');

  const handleCellClick = (index: number) => {
    if (mode === 'robot') {
      setRobotStart(index);
      // Remover outros elementos desta célula
      setObstacles(prev => prev.filter(i => i !== index));
      setStars(prev => prev.filter(i => i !== index));
      if (index === goalPos) setGoalPos(-1);
    } else if (mode === 'goal') {
      setGoalPos(index);
      setObstacles(prev => prev.filter(i => i !== index));
      setStars(prev => prev.filter(i => i !== index));
      if (index === robotStart) setRobotStart(-1);
    } else if (mode === 'obstacle') {
      if (index === robotStart || index === goalPos) return;
      if (obstacles.includes(index)) {
        setObstacles(prev => prev.filter(i => i !== index));
      } else {
        setObstacles(prev => [...prev, index]);
        setStars(prev => prev.filter(i => i !== index));
      }
    } else if (mode === 'star') {
      if (index === robotStart || index === goalPos || obstacles.includes(index)) return;
      if (stars.includes(index)) {
        setStars(prev => prev.filter(i => i !== index));
      } else {
        setStars(prev => [...prev, index]);
      }
    }
  };

  const handleSalvar = async () => {
    if (!titulo || !objetivo) {
      alert('Por favor, preencha o título e o objetivo.');
      return;
    }

    if (robotStart === -1 || goalPos === -1) {
      alert('Defina o ponto de partida do robô e o ponto de chegada!');
      return;
    }

    try {
      setLoading(true);
      
      const config_tabuleiro = {
        grid_size: gridSize,
        robot_start: robotStart,
        goal_pos: goalPos,
        obstacles: obstacles,
        stars: stars
      };

      const regras = {
        limites: {
          "Mover para frente": limiteMover === '' ? undefined : limiteMover,
          "Virar à direita": limiteVirar === '' ? undefined : limiteVirar,
          "Virar à esquerda": limiteVirar === '' ? undefined : limiteVirar
        }
      };

      const { error } = await supabase
        .from('desafios')
        .insert([{
          titulo,
          objetivo,
          descricao,
          dificuldade,
          pontos_recompensa: pontos,
          config_tabuleiro,
          regras,
          professor_id: user?.id
        }]);

      if (error) throw error;

      alert('Desafio criado com sucesso!');
      navigate('/dashboard-professor');
    } catch (error: any) {
      console.error('Erro ao criar desafio:', error);
      alert(`Erro ao salvar desafio: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link to="/dashboard-professor" className="text-gray-600 hover:text-gray-900 flex-shrink-0">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-blue-700 font-bold truncate text-sm sm:text-base md:text-xl">Criar Novo Desafio</h1>
          </div>
          <button
            onClick={handleSalvar}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex-shrink-0 text-sm"
            aria-label="Salvar Desafio"
            title="Salvar Desafio"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{loading ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna de Configurações */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-600" />
                Informações Básicas
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título do Desafio</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Labirinto dos Loops"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo (Curto)</label>
                  <input
                    type="text"
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                    placeholder="Ex: Chegue à bandeira usando 2 loops"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dica/Descrição</label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldade</label>
                    <select 
                      value={dificuldade}
                      onChange={(e) => setDificuldade(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option>Fácil</option>
                      <option>Médio</option>
                      <option>Difícil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pontos</label>
                    <input
                      type="number"
                      value={pontos}
                      onChange={(e) => setPontos(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-purple-600" />
                Restrições de Blocos
              </h2>
              <p className="text-xs text-gray-500 mb-4">Deixe em branco para uso ilimitado</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Máx. Mover para frente</span>
                  <input
                    type="number"
                    value={limiteMover}
                    onChange={(e) => setLimiteMover(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-16 p-1 border border-gray-300 rounded text-center"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Máx. Virar (Dir/Esq)</span>
                  <input
                    type="number"
                    value={limiteVirar}
                    onChange={(e) => setLimiteVirar(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-16 p-1 border border-gray-300 rounded text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coluna do Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-green-600" />
                  Desenho do Mapa
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Tamanho:</span>
                  <select 
                    value={gridSize}
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value);
                      setGridSize(newSize);
                      setRobotStart(0);
                      setGoalPos(newSize * newSize - 1);
                      setObstacles([]);
                      setStars([]);
                    }}
                    className="p-1 border border-gray-300 rounded"
                  >
                    <option value={4}>4x4</option>
                    <option value={5}>5x5</option>
                    <option value={6}>6x6</option>
                    <option value={8}>8x8</option>
                  </select>
                </div>
              </div>

              {/* Toolbar do Editor */}
              <div className="flex flex-wrap gap-2 mb-6 p-2 bg-gray-50 rounded-lg border border-gray-200">
                <button
                  onClick={() => setMode('obstacle')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${mode === 'obstacle' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
                >
                  <Box className="w-4 h-4" /> Paredes (🧱)
                </button>
                <button
                  onClick={() => setMode('star')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${mode === 'star' ? 'bg-yellow-400 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
                >
                  <Star className="w-4 h-4" /> Estrelas (⭐)
                </button>
                <button
                  onClick={() => setMode('robot')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${mode === 'robot' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
                >
                  <ChevronRight className="w-4 h-4" /> Início (🤖)
                </button>
                <button
                  onClick={() => setMode('goal')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${mode === 'goal' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
                >
                  <Flag className="w-4 h-4" /> Chegada (🏁)
                </button>
              </div>

              {/* Grid Interativo */}
              <div className="flex justify-center">
                <div 
                  className="grid gap-1 bg-gray-200 p-1 rounded-lg border-2 border-gray-300"
                  style={{ 
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    width: 'min(500px, 100%)',
                    aspectRatio: '1/1'
                  }}
                >
                  {Array.from({ length: gridSize * gridSize }, (_, i) => {
                    const isRobot = i === robotStart;
                    const isGoal = i === goalPos;
                    const isObstacle = obstacles.includes(i);
                    const isStar = stars.includes(i);

                    return (
                      <button
                        key={i}
                        onClick={() => handleCellClick(i)}
                        className={`w-full h-full rounded flex items-center justify-center transition-all ${
                          isRobot ? 'bg-blue-500 text-white shadow-inner' :
                          isGoal ? 'bg-green-500 text-white animate-pulse' :
                          isObstacle ? 'bg-gray-800 text-gray-400' :
                          isStar ? 'bg-yellow-100 border-2 border-yellow-400 text-yellow-600' :
                          'bg-white hover:bg-blue-50'
                        }`}
                      >
                        {isRobot && <ChevronRight className="w-6 h-6 stroke-[3px]" />}
                        {isGoal && <Flag className="w-6 h-6 fill-current" />}
                        {isObstacle && <Box className="w-4 h-4 opacity-50" />}
                        {isStar && <Star className="w-5 h-5 fill-current" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4 italic">
                {mode === 'obstacle' && "Clique para adicionar ou remover paredes."}
                {mode === 'star' && "Clique para adicionar estrelas de bônus."}
                {mode === 'robot' && "Escolha onde o robô deve começar."}
                {mode === 'goal' && "Escolha a célula final de vitória."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
