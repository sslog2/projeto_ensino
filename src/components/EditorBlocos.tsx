import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, HelpCircle, Lightbulb, Loader2, Plus, Target, ArrowUp, RotateCw, Star, ChevronRight, Eye } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface Bloco {
  id: string;
  tipo: 'inicio' | 'acao' | 'condicional' | 'loop' | 'fim';
  conteudo: string;
  cor: string;
  icone: React.ReactNode;
}

export function EditorBlocos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [desafio, setDesafio] = useState<any>(null);
  const [blocosSolucao, setBlocosSolucao] = useState<Bloco[]>([]);
  const [executando, setExecutando] = useState(false);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [alerta, setAlerta] = useState<{ tipo: 'erro' | 'info', mensagem: string } | null>(null);
  const [statusExecucao, setStatusExecucao] = useState(''); // Para aria-live
  const [startTime] = useState(Date.now()); // NOVO: Início do desafio

  // Estados do Robô para animação real
  const [robotPos, setRobotPos] = useState(0);
  const [robotDir, setRobotDir] = useState(0); // 0: Direita, 1: Baixo, 2: Esquerda, 3: Cima
  const [estrelasColetadas, setEstrelasColetadas] = useState<number[]>([]);
  
  // Estado para Apoio Cognitivo
  const [ghostPath, setGhostPath] = useState<number[]>([]);
  const [previewing, setPreviewing] = useState(false);

  const [blocosDisponiveis] = useState<Bloco[]>([
    { id: '1', tipo: 'acao', conteudo: 'Mover para frente', cor: 'bg-blue-500', icone: <ArrowUp className="w-5 h-5" /> },
    { id: '2', tipo: 'acao', conteudo: 'Virar à direita', cor: 'bg-indigo-500', icone: <RotateCw className="w-5 h-5" /> },
    { id: '3', tipo: 'acao', conteudo: 'Virar à esquerda', cor: 'bg-indigo-500', icone: <RotateCcw className="w-5 h-5" /> },
    { id: '4', tipo: 'acao', conteudo: 'Pegar estrela', cor: 'bg-green-500', icone: <Star className="w-5 h-5" /> },
  ]);

  useEffect(() => {
    fetchDesafio();
  }, [id]);

  const fetchDesafio = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('desafios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setDesafio(data);
      setRobotPos(data.config_tabuleiro?.robot_start || 0);
    } catch (error) {
      console.error('Erro ao buscar desafio:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarBloco = (bloco: Bloco) => {
    setAlerta(null);
    
    // Verificar limites de blocos (Regras do Professor)
    if (desafio?.regras?.limites) {
      const contagemAtual = blocosSolucao.filter(b => b.conteudo === bloco.conteudo).length;
      const limite = desafio.regras.limites[bloco.conteudo] || desafio.regras.limites[bloco.id];
      
      if (limite !== undefined && contagemAtual >= limite) {
        setAlerta({ 
          tipo: 'erro', 
          mensagem: `Você atingiu o limite de blocos para "${bloco.conteudo}" neste desafio! 🛑` 
        });
        return;
      }
    }

    setBlocosSolucao([...blocosSolucao, { ...bloco, id: `${bloco.id}-${Date.now()}` }]);
  };

  const removerBloco = (index: number) => {
    setAlerta(null);
    setBlocosSolucao(blocosSolucao.filter((_, i) => i !== index));
  };

  const limparSolucao = () => {
    setAlerta(null);
    setBlocosSolucao([]);
    setRobotPos(desafio?.config_tabuleiro?.robot_start || 0);
    setRobotDir(0);
    setEstrelasColetadas([]);
    setGhostPath([]);
  };

  const previewCodigo = () => {
    if (!desafio) return;
    setPreviewing(true);
    setAlerta(null);
    
    let currentPos = desafio.config_tabuleiro?.robot_start || 0;
    let currentDir = 0; 
    const gridSize = desafio.config_tabuleiro?.grid_size || 5;
    const path: number[] = [currentPos];

    for (let i = 0; i < blocosSolucao.length; i++) {
      const bloco = blocosSolucao[i];

      if (bloco.conteudo === 'Mover para frente') {
        const row = Math.floor(currentPos / gridSize);
        const col = currentPos % gridSize;
        let nextPos = currentPos;
        let bati = false;

        if (currentDir === 0) { // Direita
          if (col < gridSize - 1) nextPos = currentPos + 1;
          else bati = true;
        } else if (currentDir === 1) { // Baixo
          if (row < gridSize - 1) nextPos = currentPos + gridSize;
          else bati = true;
        } else if (currentDir === 2) { // Esquerda
          if (col > 0) nextPos = currentPos - 1;
          else bati = true;
        } else if (currentDir === 3) { // Cima
          if (row > 0) nextPos = currentPos - gridSize;
          else bati = true;
        }

        // Verificar obstáculos
        if (desafio.config_tabuleiro?.obstacles?.includes(nextPos)) {
          bati = true;
        }

        if (!bati) {
          currentPos = nextPos;
          path.push(currentPos);
        } else {
          break; // Parar a prévia se bater em uma parede ou obstáculo
        }
      } 
      else if (bloco.conteudo === 'Virar à direita') {
        currentDir = (currentDir + 1) % 4;
      } 
      else if (bloco.conteudo === 'Virar à esquerda') {
        currentDir = (currentDir + 3) % 4;
      }
    }

    setGhostPath(path);
    setTimeout(() => {
      setPreviewing(false);
    }, 1000); // O destaque pisca por 1 segundo
  };

  const salvarProgresso = async (sucesso: boolean, pontosAtuais: number, tempo?: number, estrelas?: number) => {
    if (!user) return 0;

    let pontosGanhosReais = 0;

    try {
      console.log('Verificando progresso anterior...', { sucesso, pontosAtuais });

      // 1. Buscar se já existe progresso para este desafio
      const { data: progressoAnterior, error: fetchError } = await supabase
        .from('progresso_alunos')
        .select('*')
        .eq('aluno_id', user.id)
        .eq('desafio_id', parseInt(id!))
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 é "not found", o que é ok se for a 1ª vez
        console.error('Erro ao buscar progresso anterior:', fetchError);
        throw fetchError;
      }

      // 2. Lógica anti-farm de pontos
      if (!progressoAnterior) {
        // Primeira vez jogando
        if (sucesso) pontosGanhosReais = pontosAtuais;
      } else {
        // Já jogou antes. Só ganha pontos se a nova pontuação for maior
        if (sucesso && pontosAtuais > (progressoAnterior.pontuacao_obtida || 0)) {
          pontosGanhosReais = pontosAtuais - (progressoAnterior.pontuacao_obtida || 0);
        }
      }

      // 3. Salvar o novo progresso
      const totalTentativas = (progressoAnterior?.tentativas || 0) + 1;
      const { error } = await supabase
        .from('progresso_alunos')
        .upsert({
          aluno_id: user.id,
          desafio_id: parseInt(id!),
          concluido: sucesso || (progressoAnterior?.concluido || false),
          pontuacao_obtida: Math.max(pontosAtuais, progressoAnterior?.pontuacao_obtida || 0),
          tentativas: totalTentativas,
          tempo_segundos: tempo || (progressoAnterior?.tempo_segundos || null),
          estrelas_obtidas: Math.max(estrelas || 0, progressoAnterior?.estrelas_obtidas || 0),
          data_conclusao: sucesso ? new Date().toISOString() : (progressoAnterior?.data_conclusao || null)
        }, {
          onConflict: 'aluno_id, desafio_id'
        });

      return { pontosGanhosReais, totalTentativas, jaConcluido: progressoAnterior?.concluido || false };

    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      alert('Aviso: Seu progresso pode não ter sido salvo. Verifique sua conexão.');
      return { pontosGanhosReais: 0, totalTentativas: 1, jaConcluido: false }; 
    }
  };

  const executarCodigo = async () => {
    setAlerta(null);
    setExecutando(true);
    let currentPos = desafio.config_tabuleiro?.robot_start || 0;
    let currentDir = 0; 
    let coletadas: number[] = [];
    const gridSize = desafio.config_tabuleiro?.grid_size || 5;

    setRobotPos(currentPos);
    setRobotDir(currentDir);
    setEstrelasColetadas([]);
    setStatusExecucao('Iniciando execução do algoritmo.');

    for (let i = 0; i < blocosSolucao.length; i++) {
      const bloco = blocosSolucao[i];
      await new Promise(r => setTimeout(r, 600));
      setStatusExecucao(`Executando comando ${i + 1} de ${blocosSolucao.length}: ${bloco.conteudo}`);

      if (bloco.conteudo === 'Mover para frente') {
        const row = Math.floor(currentPos / gridSize);
        const col = currentPos % gridSize;
        let nextPos = currentPos;
        let bati = false;

        if (currentDir === 0) { // Direita
          if (col < gridSize - 1) nextPos = currentPos + 1;
          else bati = true;
        } else if (currentDir === 1) { // Baixo
          if (row < gridSize - 1) nextPos = currentPos + gridSize;
          else bati = true;
        } else if (currentDir === 2) { // Esquerda
          if (col > 0) nextPos = currentPos - 1;
          else bati = true;
        } else if (currentDir === 3) { // Cima
          if (row > 0) nextPos = currentPos - gridSize;
          else bati = true;
        }

        // Verificar bordas e obstáculos
        if (bati || desafio.config_tabuleiro?.obstacles?.includes(nextPos)) {
          setAlerta({ tipo: 'erro', mensagem: 'O robô bateu em um obstáculo ou na borda! 💥' });
          setExecutando(false);
          await salvarProgresso(false, 0); // Registrar tentativa falha
          return;
        }
        currentPos = nextPos;
      } 
      else if (bloco.conteudo === 'Virar à direita') {
        currentDir = (currentDir + 1) % 4;
      } 
      else if (bloco.conteudo === 'Virar à esquerda') {
        currentDir = (currentDir + 3) % 4;
      }
      else if (bloco.conteudo === 'Pegar estrela') {
        if (desafio.config_tabuleiro?.stars?.includes(currentPos)) {
          if (!coletadas.includes(currentPos)) {
            coletadas.push(currentPos);
            setEstrelasColetadas(prev => [...prev, currentPos]);
          }
        } else {
          setAlerta({ tipo: 'erro', mensagem: 'Não há estrela aqui para pegar! ❌' });
          setExecutando(false);
          await salvarProgresso(false, 0); // Registrar tentativa falha
          return;
        }
      }

      setRobotPos(currentPos);
      setRobotDir(currentDir);
    }

    await new Promise(r => setTimeout(r, 1000));
    setExecutando(false);

    const tempoGasto = Math.floor((Date.now() - startTime) / 1000);
    const totalEstrelasColetadas = coletadas.length;

    // Nova Condição de Vitória: Chegar no ponto final (goal_pos)
    const chegouNoObjetivo = currentPos === (desafio.config_tabuleiro?.goal_pos ?? -1);

    if (!chegouNoObjetivo) {
      setAlerta({ tipo: 'erro', mensagem: 'Você não chegou ao destino final! 🏁' });
      await salvarProgresso(false, 0, tempoGasto, totalEstrelasColetadas); // Registrar tentativa falha com métricas
      return;
    }

    // Pontuação: Sucesso base + Bônus por estrelas
    const pontosBase = desafio?.pontos_recompensa || 100;
    const bonusPorEstrela = 25;
    
    // Penalidade leve por excesso de blocos para incentivar eficiência
    const penalidadePorBloco = 2; 
    const pontuacaoFinal = Math.max(
      10, 
      pontosBase + (totalEstrelasColetadas * bonusPorEstrela) - (blocosSolucao.length * penalidadePorBloco)
    );

    const { pontosGanhosReais, totalTentativas } = await salvarProgresso(true, pontuacaoFinal, tempoGasto, totalEstrelasColetadas);

    // Calcular Conquistas Reais (Medalhas)
    const medalhas = [];
    if (totalTentativas === 1) medalhas.push('Primeira Tentativa');
    
    // Regra de eficiência: usou menos ou igual ao limite de blocos sugerido (padrão 8 se não definido)
    const limiteEficiente = desafio.regras?.max_blocos || 8;
    if (blocosSolucao.length <= limiteEficiente) medalhas.push('Código Eficiente');
    
    const totalEstrelasNoNivel = desafio.config_tabuleiro?.stars?.length || 0;
    if (totalEstrelasNoNivel > 0 && totalEstrelasColetadas === totalEstrelasNoNivel) {
      medalhas.push('Colecionador de Estrelas');
    }

    // Calcular Rating de Estrelas (Visual)
    let estrelasRating = 1; // Mínimo 1 por chegar no objetivo
    
    if (totalEstrelasNoNivel === 0 || totalEstrelasColetadas === totalEstrelasNoNivel) {
      estrelasRating = 3;
    } else if (totalEstrelasColetadas > 0) {
      estrelasRating = 2;
    }

    const medalhasUrl = medalhas.join(',');
    navigate(`/resultado/${id}?sucesso=true&pontos=${pontosGanhosReais}&estrelas=${estrelasRating}&tempo=${tempoGasto}s&tentativas=${totalTentativas}&medalhas=${medalhasUrl}`);
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!desafio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50">
        <h2 className="text-gray-800 mb-4">Desafio não encontrado</h2>
        <Link to="/mapa-desafios" className="text-purple-600 font-medium">Voltar ao Mapa</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Link to="/mapa-desafios" className="text-gray-600 hover:text-gray-900 flex-shrink-0">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-purple-700 font-bold truncate text-sm sm:text-base md:text-xl" title={desafio.titulo}>{desafio.titulo}</h1>
                <p className="text-gray-600 text-xs sm:text-sm truncate hidden sm:block">{desafio.objetivo}</p>
              </div>
            </div>
            <button
              onClick={() => setMostrarDica(!mostrarDica)}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex-shrink-0 text-sm"
              title="Dica"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Dica</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Região Invisível para Anúncios de Screen Reader */}
        <div className="sr-only" aria-live="assertive">
          {statusExecucao}
        </div>

        {mostrarDica && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-yellow-900 mb-1">💡 Dica</h3>
                <p className="text-yellow-800">{desafio.descricao}</p>
              </div>
            </div>
          </div>
        )}

        {alerta && (
          <div 
            role="alert"
            aria-live="polite"
            className={`border-2 rounded-xl p-4 mb-6 animate-in zoom-in-95 duration-300 ${
            alerta.tipo === 'erro' ? 'bg-red-50 border-red-300 text-red-800' : 'bg-blue-50 border-blue-300 text-blue-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {alerta.tipo === 'erro' ? '⚠️' : 'ℹ️'}
              </div>
              <p className="font-medium">{alerta.mensagem}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 main-content">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Visualização do Desafio</h3>
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-4 relative">
                <div 
                  className="grid gap-2 h-full" 
                  style={{ 
                    gridTemplateColumns: `repeat(${desafio.config_tabuleiro?.grid_size || 5}, 1fr)`,
                    gridTemplateRows: `repeat(${desafio.config_tabuleiro?.grid_size || 5}, 1fr)` 
                  }}
                >
                  {Array.from({ length: Math.pow(desafio.config_tabuleiro?.grid_size || 5, 2) }, (_, i) => {
                    const isRobot = i === robotPos;
                    const isEstrela = desafio.config_tabuleiro?.stars?.includes(i) && !estrelasColetadas.includes(i);
                    const isObstacle = desafio.config_tabuleiro?.obstacles?.includes(i);
                    const isGoal = i === desafio.config_tabuleiro?.goal_pos;
                    const isGhost = ghostPath.includes(i);
                    const row = Math.floor(i / (desafio.config_tabuleiro?.grid_size || 5)) + 1;
                    const col = (i % (desafio.config_tabuleiro?.grid_size || 5)) + 1;
                    
                    return (
                      <div
                        key={i}
                        role="img"
                        aria-label={`Célula fila ${row}, coluna ${col}${isRobot ? ', Robô está aqui' : ''}${isEstrela ? ', contém uma Estrela' : ''}${isObstacle ? ', é um Obstáculo' : ''}${isGoal ? ', é o Ponto de Chegada' : ''}`}
                        className={`rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                          isRobot ? 'bg-blue-400 border-white shadow-inner' : 
                          isObstacle ? 'bg-gray-800 border-gray-900 shadow-lg' :
                          isGoal ? 'bg-green-100 border-green-500 border-dashed' :
                          isGhost ? 'bg-purple-200 border-dashed border-purple-400 opacity-70 scale-95' :
                          isEstrela ? 'bg-yellow-300 border-white' : 'bg-white/50 border-white'
                        }`}
                      >
                        {isRobot && (
                          <div 
                            className="bg-blue-600 rounded-full p-2 shadow-lg transition-transform duration-300"
                            style={{ transform: `rotate(${robotDir * 90}deg)` }}
                          >
                            <ChevronRight className="w-8 h-8 text-white stroke-[3px]" />
                          </div>
                        )}
                        {isObstacle && <div className="w-full h-full flex items-center justify-center text-gray-400 opacity-50">🧱</div>}
                        {isGoal && !isRobot && <div className="text-3xl animate-bounce">🏁</div>}
                        {isEstrela && <span className="text-2xl animate-pulse">⭐</span>}
                        {isGhost && !isRobot && !isGoal && <div className="w-2 h-2 rounded-full bg-purple-500 opacity-50" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

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
                      <p>Adicione blocos da paleta ao lado</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {blocosSolucao.map((bloco, index) => (
                      <button
                        key={bloco.id}
                        aria-label={`Bloco ${index + 1}: ${bloco.conteudo}. Clique para remover.`}
                        className={`${bloco.cor} text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        onClick={() => removerBloco(index)}
                      >
                        {bloco.icone}
                        <span>{bloco.conteudo}</span>
                        <span className="text-xs bg-white/20 px-1 rounded" aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-4">
                {user?.necessidades_cognitivas && (
                  <button
                    onClick={previewCodigo}
                    disabled={blocosSolucao.length === 0 || executando || previewing}
                    className="flex-1 py-4 bg-purple-100 text-purple-700 border-2 border-purple-300 rounded-xl font-bold hover:bg-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                    aria-label="Ver prévia do caminho do robô (Apoio Cognitivo)"
                  >
                    {previewing ? (
                      <><Loader2 className="w-6 h-6 animate-spin" /> ...</>
                    ) : (
                      <><Eye className="w-6 h-6" /> Prévia</>
                    )}
                  </button>
                )}
                
                <button
                  onClick={executarCodigo}
                  disabled={blocosSolucao.length === 0 || executando}
                  className="flex-[2] py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                >
                  {executando ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Executando...</>
                  ) : (
                    <><Play className="w-6 h-6 fill-current" /> Executar Algoritmo</>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 sidebar-container pedagogical-focus">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Comandos</h3>
              <div className="grid grid-cols-1 gap-3">
                {blocosDisponiveis.map((bloco) => (
                  <button
                    key={bloco.id}
                    onClick={() => adicionarBloco(bloco)}
                    disabled={executando}
                    aria-label={`Adicionar comando: ${bloco.conteudo}`}
                    className={`w-full ${bloco.cor} text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 text-left font-medium flex justify-between items-center group focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  >
                    <div className="flex items-center gap-3">
                      <div aria-hidden="true">{bloco.icone}</div>
                      {bloco.conteudo}
                    </div>
                    <Plus className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Missão
              </h3>
              <p className="text-purple-100 text-sm leading-relaxed">{desafio.objetivo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
