import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, HelpCircle, Lightbulb } from 'lucide-react';

interface Bloco {
  id: string;
  tipo: 'inicio' | 'acao' | 'condicional' | 'loop' | 'fim';
  conteudo: string;
  cor: string;
}

export function EditorBlocos() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [blocosDisponiveis] = useState<Bloco[]>([
    { id: '1', tipo: 'acao', conteudo: 'Mover para frente', cor: 'bg-blue-500' },
    { id: '2', tipo: 'acao', conteudo: 'Virar à direita', cor: 'bg-blue-500' },
    { id: '3', tipo: 'acao', conteudo: 'Virar à esquerda', cor: 'bg-blue-500' },
    { id: '4', tipo: 'acao', conteudo: 'Pegar item', cor: 'bg-green-500' },
    { id: '5', tipo: 'condicional', conteudo: 'Se (condição)', cor: 'bg-yellow-500' },
    { id: '6', tipo: 'loop', conteudo: 'Repetir 3 vezes', cor: 'bg-purple-500' },
  ]);

  const [blocosSolucao, setBlocosSolucao] = useState<Bloco[]>([]);
  const [executando, setExecutando] = useState(false);
  const [mostrarDica, setMostrarDica] = useState(false);

  const desafio = {
    id: id,
    titulo: 'Coletando Estrelas',
    descricao: 'Ajude o robô a coletar todas as estrelas do tabuleiro. Use os blocos de movimento e ação para criar uma sequência de comandos.',
    objetivo: 'Coletar 3 estrelas',
    dica: 'Tente criar um caminho que passe por todas as estrelas. Use o bloco de repetição para otimizar sua solução!'
  };

  const adicionarBloco = (bloco: Bloco) => {
    setBlocosSolucao([...blocosSolucao, { ...bloco, id: `${bloco.id}-${Date.now()}` }]);
  };

  const removerBloco = (index: number) => {
    setBlocosSolucao(blocosSolucao.filter((_, i) => i !== index));
  };

  const limparSolucao = () => {
    setBlocosSolucao([]);
  };

  const executarCodigo = async () => {
    setExecutando(true);
    // Simulação de execução
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExecutando(false);
    
    // Simular resultado (60% de chance de sucesso para demo)
    const sucesso = Math.random() > 0.4;
    navigate(`/resultado/${id}?sucesso=${sucesso}&pontos=${sucesso ? 150 : 50}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/mapa-desafios" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-purple-700">{desafio.titulo}</h1>
                <p className="text-gray-600">{desafio.objetivo}</p>
              </div>
            </div>
            <button
              onClick={() => setMostrarDica(!mostrarDica)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              Dica
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dica */}
        {mostrarDica && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-yellow-900 mb-1">💡 Dica</h3>
                <p className="text-yellow-800">{desafio.dica}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área de Visualização */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabuleiro/Visualização */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Visualização do Desafio</h3>
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-4 relative">
                {/* Grade 5x5 */}
                <div className="grid grid-cols-5 grid-rows-5 gap-2 h-full">
                  {Array.from({ length: 25 }, (_, i) => {
                    const isRobot = i === 0;
                    const isEstrela = [6, 12, 18].includes(i);
                    return (
                      <div
                        key={i}
                        className={`rounded-lg border-2 border-white flex items-center justify-center ${
                          isRobot ? 'bg-blue-400' : isEstrela ? 'bg-yellow-300' : 'bg-white/50'
                        }`}
                      >
                        {isRobot && <span className="text-2xl">🤖</span>}
                        {isEstrela && <span className="text-2xl">⭐</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Área de Solução */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800">Sua Solução</h3>
                <button
                  onClick={limparSolucao}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="w-4 h-4" />
                  Limpar
                </button>
              </div>

              <div className="min-h-[200px] bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                {blocosSolucao.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <HelpCircle className="w-12 h-12 mx-auto mb-2" />
                      <p>Arraste blocos aqui para criar sua solução</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {blocosSolucao.map((bloco, index) => (
                      <div
                        key={bloco.id}
                        className={`${bloco.cor} text-white p-3 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity`}
                        onClick={() => removerBloco(index)}
                      >
                        <span>{bloco.conteudo}</span>
                        <span className="text-xs opacity-75">Clique para remover</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={executarCodigo}
                disabled={blocosSolucao.length === 0 || executando}
                className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {executando ? (
                  <>Executando...</>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Executar Código
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Paleta de Blocos */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Blocos Disponíveis</h3>
              <div className="space-y-3">
                {blocosDisponiveis.map((bloco) => (
                  <button
                    key={bloco.id}
                    onClick={() => adicionarBloco(bloco)}
                    className={`w-full ${bloco.cor} text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95`}
                  >
                    {bloco.conteudo}
                  </button>
                ))}
              </div>
            </div>

            {/* Informações do Desafio */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="mb-3">📋 Descrição</h3>
              <p className="text-purple-100">{desafio.descricao}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
