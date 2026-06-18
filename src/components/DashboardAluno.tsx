import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Star, Users, Code2, LogOut, User, Map, Zap, Loader2 } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';
import { supabase } from '../supabaseClient';
import { calcularProgressoNivel } from '../utils/leveling';

export function DashboardAluno() {
  const { user, logout } = useAuth();
  const [desafios, setDesafios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posicaoRanking, setPosicaoRanking] = useState<number | null>(null);
  const [pontosTurma, setPontosTurma] = useState(0);
  const [streak, setStreak] = useState(0);
  const [numAlunos, setNumAlunos] = useState(1);
  const [metaPorAluno, setMetaPorAluno] = useState(500);

  const metaTurma = numAlunos * metaPorAluno; // Meta dinâmica

  const [conquistas, setConquistas] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Desafios Recomendados (os 3 primeiros não concluídos)
      const { data: desafiosData, error: errorDesafios } = await supabase
        .from('desafios')
        .select('*');

      if (errorDesafios) throw errorDesafios;

      const { data: progressoData } = await supabase
        .from('progresso_alunos')
        .select('*')
        .eq('aluno_id', user?.id);

      const listaProgresso = progressoData || [];
      const concluidosIds = listaProgresso
        .filter(p => p.concluido)
        .map(p => p.desafio_id);
      
      const desafiosFormatados = (desafiosData || [])
        .filter(d => !concluidosIds.includes(d.id))
        .slice(0, 3);

      setDesafios(desafiosFormatados);

      // 2. Calcular Sequência (Streak)
      if (listaProgresso.length > 0) {
        const uniqueDays = [...new Set(listaProgresso
          .map(p => p.data_conclusao ? p.data_conclusao.split('T')[0] : null)
          .filter(d => d !== null)
        )].sort((a, b) => b!.localeCompare(a!));
        
        let s = 0;
        if (uniqueDays.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          
          if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
            s = 1;
            for (let i = 0; i < uniqueDays.length - 1; i++) {
              const current = new Date(uniqueDays[i]!);
              const next = new Date(uniqueDays[i+1]!);
              const diff = Math.round((current.getTime() - next.getTime()) / (1000 * 3600 * 24));
              if (diff === 1) s++;
              else break;
            }
          }
        }
        setStreak(s);
      }

      // 3. Conquistas Dinâmicas (9 categorias)
      const concluidosCount = concluidosIds.length;
      const totalEstrelas = listaProgresso.reduce((acc, p) => acc + (p.estrelas_obtidas || 0), 0);
      const melhorTempo = Math.min(...listaProgresso.filter(p => p.tempo_segundos).map(p => p.tempo_segundos)) || 999;

      const todasConquistas = [
        { id: 1, titulo: 'Primeira Vitória', icone: '🏆', desbloqueado: concluidosCount >= 1 },
        { id: 2, titulo: 'Veloz como um Raio', icone: '⚡', desbloqueado: melhorTempo <= 15 },
        { id: 3, titulo: 'Céu Estrelado', icone: '⭐', desbloqueado: totalEstrelas >= 10 },
        { id: 4, titulo: 'Persistente', icone: '🔥', desbloqueado: listaProgresso.some(p => p.tentativas >= 5) },
        { id: 5, titulo: 'Perfeccionista', icone: '✨', desbloqueado: listaProgresso.some(p => p.estrelas_obtidas >= 3) },
        { id: 6, titulo: 'Explorador', icone: '🗺️', desbloqueado: concluidosCount >= 5 },
        { id: 7, titulo: 'Colecionador', icone: '💰', desbloqueado: (user?.pontos || 0) >= 1000 },
        { id: 8, titulo: 'Veterano', icone: '🎖️', desbloqueado: (user?.nivel || 0) >= 10 },
        { id: 9, titulo: 'Mestre da Lógica', icone: '🧠', desbloqueado: concluidosCount >= 10 },
      ];
      setConquistas(todasConquistas.filter(c => c.desbloqueado).slice(0, 3)); // Mostra as 3 primeiras desbloqueadas

      // 4. Ranking e Pontos da Turma
      const { data: vinculo } = await supabase
        .from('alunos_turmas')
        .select(`
          turma_id,
          turmas:turma_id (meta_pontos)
        `)
        .eq('aluno_id', user?.id)
        .single();

      if (vinculo) {
        if (vinculo.turmas && (vinculo.turmas as any).meta_pontos) {
          setMetaPorAluno((vinculo.turmas as any).meta_pontos);
        }

        const { data: alunos } = await supabase
          .from('alunos_turmas')
          .select(`
            aluno_id,
            profiles:aluno_id (pontos)
          `)
          .eq('turma_id', vinculo.turma_id);

        if (alunos) {
          setNumAlunos(alunos.length);
          const total = alunos.reduce((acc, a: any) => acc + (a.profiles.pontos || 0), 0);
          setPontosTurma(total);

          const r = (alunos || [])
            .map((a: any) => ({
              id: a.aluno_id,
              pontos: a.profiles.pontos || 0
            }))
            .sort((a, b) => b.pontos - a.pontos);
          
          const index = r.findIndex(a => a.id === user?.id);
          if (index !== -1) setPosicaoRanking(index + 1);
        }
      }

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Code2 className="w-8 h-8 text-purple-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-600 text-xs sm:text-sm">Olá,</p>
              <h1 className="text-purple-700 font-bold truncate text-sm sm:text-base md:text-xl" title={user?.nome}>{user?.nome}</h1>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="btn-logout flex items-center gap-2 text-gray-600 hover:text-gray-900 flex-shrink-0 text-sm sm:text-base"
            aria-label="Sair da conta"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6 main-content">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4" role="region" aria-label="Suas estatísticas">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg" role="status" aria-label={`Nível atual: ${user?.nivel || 1}`}>
                <div className="flex justify-between items-start mb-2">
                  <Trophy className="w-8 h-8" aria-hidden="true" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-bold">
                    {calcularProgressoNivel(user?.pontos || 0).porcentagem}%
                  </span>
                </div>
                <p className="text-yellow-100">Nível</p>
                <p className="text-white font-bold text-2xl mb-2">{user?.nivel || 1}</p>
                <div className="w-full bg-black/10 rounded-full h-1.5 mb-1">
                  <div 
                    className="bg-white h-1.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${calcularProgressoNivel(user?.pontos || 0).porcentagem}%` }}
                  />
                </div>
                <p className="text-[10px] text-yellow-50/80 italic">
                  +{calcularProgressoNivel(user?.pontos || 0).pontosRestantes} pts para o nível {calcularProgressoNivel(user?.pontos || 0).nivel + 1}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg" role="status" aria-label={`Total de pontos: ${user?.pontos || 0}`}>
                <Star className="w-8 h-8 mb-2" aria-hidden="true" />
                <p className="text-purple-100">Pontos</p>
                <p className="text-white font-bold text-2xl">{user?.pontos || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-lg" role="status" aria-label={`Sua sequência atual é de ${streak} ${streak === 1 ? 'dia' : 'dias'}`}>
                <Zap className="w-8 h-8 mb-2" aria-hidden="true" />
                <p className="text-blue-100">Sequência</p>
                <p className="text-white font-bold text-2xl">{streak} {streak === 1 ? 'dia' : 'dias'}</p>
              </div>
            </div>

            {/* Desafios Recomendados */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-800">Próximos Desafios</h2>
                <Link to="/mapa-desafios" className="text-purple-600 hover:text-purple-700 flex items-center gap-1" aria-label="Ver todos os próximos desafios">
                  Ver todos
                  <Map className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {desafios.map(desafio => (
                  <Link
                    key={desafio.id}
                    to={`/desafio/${desafio.id}`}
                    className={`block p-4 rounded-lg border-2 transition-all ${
                      desafio.concluido 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:border-purple-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-gray-800">{desafio.titulo}</h3>
                        <p className="text-gray-600">Dificuldade: {desafio.dificuldade}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-5 h-5 fill-current" />
                          <span>{desafio.pontos_recompensa}</span>
                        </div>
                      </div>
                    </div>
                    
                    {desafio.concluido && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <Trophy className="w-4 h-4" />
                        Concluído!
                      </div>
                    )}
                  </Link>
                ))}

                {desafios.length === 0 && (
                  <p className="text-center py-4 text-gray-500">Nenhum desafio recomendado no momento.</p>
                )}
              </div>
            </div>

            {/* Atalhos Rápidos */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/ranking"
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-400"
              >
                <Users className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="text-gray-800 mb-1">Ranking da Turma</h3>
                <p className="text-gray-600">
                  {posicaoRanking 
                    ? `Você está em ${posicaoRanking}º lugar!` 
                    : 'Carregando ranking...'}
                </p>
              </Link>

              <Link
                to="/desplugado-aluno"
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-green-400"
              >
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="text-gray-800 mb-1">Atividades Desplugadas</h3>
                <p className="text-gray-600">
                  Acesse materiais e inscreva-se
                </p>
              </Link>
              </div>
              </div>

          {/* Sidebar */}
          <div className="space-y-6 sidebar-container">
            {/* Avatar e Perfil */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <AvatarEvolutivo
                  nivel={user?.nivel || 1}
                  tipo={user?.avatar?.corpo || 'basic'}
                />
                <Link to="/perfil" className="mt-4 flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700">
                  <User className="w-4 h-4" />
                  Visualizar perfil
                </Link>
              </div>
            </div>

            {/* Conquistas Recentes */}
            <div className="bg-white rounded-xl shadow-lg p-6" role="region" aria-label="Suas conquistas">
              <h3 className="text-gray-800 mb-4">Conquistas</h3>
              <div className="space-y-3">
                {conquistas.map(conquista => (
                  <div
                    key={conquista.id}
                    role="listitem"
                    aria-label={`${conquista.titulo}: Desbloqueada`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200"
                  >
                    <div className="text-2xl" aria-hidden="true">{conquista.icone}</div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-bold text-sm">{conquista.titulo}</p>
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-600" aria-hidden="true" />
                  </div>
                ))}
                {conquistas.length === 0 && (
                  <p className="text-center py-4 text-gray-500 italic text-sm">
                    Complete desafios para ganhar conquistas! 🏆
                  </p>
                )}
              </div>
            </div>

            {/* Progresso Semanal */}
            <div className="bg-white rounded-xl shadow-lg p-6" role="region" aria-label="Progresso da turma">
              <h3 className="text-gray-800 mb-4">Meta Semanal da Turma</h3>
              <div className="mb-2">
                <div className="flex justify-between text-gray-600 mb-2" aria-hidden="true">
                  <span>{pontosTurma} / {metaTurma} pontos</span>
                  <span>{Math.min(100, Math.round((pontosTurma / metaTurma) * 100))}%</span>
                </div>
                <div 
                  className="w-full bg-gray-200 rounded-full h-3"
                  role="progressbar"
                  aria-valuenow={pontosTurma}
                  aria-valuemin={0}
                  aria-valuemax={metaTurma}
                  aria-label={`Progresso da meta da turma: ${Math.min(100, Math.round((pontosTurma / metaTurma) * 100))}% atingido`}
                >
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (pontosTurma / metaTurma) * 100)}%` }} 
                  />
                </div>
              </div>
              <p className="text-gray-600 mt-3">
                {pontosTurma >= metaTurma 
                  ? 'Parabéns! A meta foi batida! 🎉' 
                  : `Faltam ${metaTurma - pontosTurma} pontos para desbloquear a recompensa coletiva! 🚀`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
