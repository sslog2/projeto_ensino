import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, AlertTriangle, TrendingUp, BookOpen, Code2, LogOut, Plus, Target, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export function DashboardProfessor() {
  const { user, logout } = useAuth();
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState({
    totalAlunos: 0,
    mediaEngajamento: 0,
    desafiosConcluidos: 0,
    horasEstudo: 0
  });

  const [alunosComDificuldade, setAlunosComDificuldade] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const { data: turmasData, error: turmasError } = await supabase
        .from('turmas')
        .select(`
          id,
          nome,
          meta_pontos,
          alunos_turmas(aluno_id, profiles:aluno_id(pontos))
        `)
        .eq('professor_id', user?.id);

      if (turmasError) throw turmasError;

      const allAlunosIds = turmasData.flatMap(t => t.alunos_turmas.map((at: any) => at.aluno_id));
      const totalAlunos = allAlunosIds.length;

      // 1. Buscar progresso para estatísticas
      const { data: progressoData } = await supabase
        .from('progresso_alunos')
        .select('aluno_id, concluido, tentativas, desafio_id')
        .in('aluno_id', allAlunosIds);

      const desafiosConcluidos = (progressoData || []).filter(p => p.concluido).length;
      
      // Engajamento: % de alunos que já jogaram pelo menos uma vez
      const alunosQueJogaram = new Set((progressoData || []).map(p => p.aluno_id)).size;
      const mediaEngajamento = totalAlunos > 0 ? Math.round((alunosQueJogaram / totalAlunos) * 100) : 0;

      // 2. Buscar alertas reais (Dificuldade: > 3 tentativas e não concluído)
      const { data: alertasReais } = await supabase
        .from('progresso_alunos')
        .select(`
          aluno_id,
          tentativas,
          desafio_id,
          profiles:aluno_id(nome),
          desafios:desafio_id(titulo)
        `)
        .in('aluno_id', allAlunosIds)
        .eq('concluido', false)
        .gt('tentativas', 3);

      const alertasFormatados = (alertasReais || []).map(a => ({
        id: a.aluno_id,
        nome: a.profiles?.nome || 'Aluno',
        desafio: a.desafios?.titulo,
        tentativas: a.tentativas,
        turma: turmasData.find(t => t.alunos_turmas.some((at: any) => at.aluno_id === a.aluno_id))?.nome
      }));

      setAlunosComDificuldade(alertasFormatados);

      const turmasFormatadas = turmasData.map(t => {
        const alertasTurma = alertasFormatados.filter(a => a.turma === t.nome).length;
        const numAlunosTurma = t.alunos_turmas.length;
        const pontosTurma = t.alunos_turmas.reduce((acc: number, curr: any) => acc + (curr.profiles?.pontos || 0), 0);
        const metaPontos = numAlunosTurma * (t.meta_pontos || 500); // Meta customizável ou padrão 500
        const progressoMeta = metaPontos > 0 ? Math.min(100, Math.round((pontosTurma / metaPontos) * 100)) : 0;

        return {
          ...t,
          alunos: numAlunosTurma,
          metaSemanal: progressoMeta,
          alertas: alertasTurma
        };
      });

      setTurmas(turmasFormatadas);
      setEstatisticas({
        totalAlunos,
        mediaEngajamento,
        desafiosConcluidos,
        horasEstudo: Math.floor(desafiosConcluidos * 0.2)
      });

    } catch (error) {
      console.error('Erro no dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Code2 className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-600 text-xs sm:text-sm">Dashboard do Professor</p>
              <h1 className="text-blue-700 font-bold truncate text-sm sm:text-base md:text-xl" title={user?.nome}>{user?.nome}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link 
              to="/professor/criar-desafio"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 text-sm"
              title="Criar Desafio"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Criar Desafio</span>
              <span className="inline sm:hidden">Criar</span>
            </Link>
            <button 
              onClick={logout} 
              className="btn-logout flex items-center gap-2 text-gray-600 hover:text-gray-900 flex-shrink-0 text-sm sm:text-base"
              aria-label="Sair da conta"
              title="Sair"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" role="region" aria-label="Estatísticas gerais das suas turmas">
              <div className="bg-white rounded-xl shadow-lg p-6" role="status" aria-label={`Total de alunos: ${estatisticas.totalAlunos}`}>
                <Users className="w-8 h-8 text-blue-600 mb-2" aria-hidden="true" />
                <p className="text-gray-600 mb-1">Total de Alunos</p>
                <p className="text-gray-900">{estatisticas.totalAlunos}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6" role="status" aria-label={`Engajamento médio: ${estatisticas.mediaEngajamento}%`}>
                <TrendingUp className="w-8 h-8 text-green-600 mb-2" aria-hidden="true" />
                <p className="text-gray-600 mb-1">Engajamento Médio</p>
                <p className="text-gray-900">{estatisticas.mediaEngajamento}%</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6" role="status" aria-label={`Total de desafios concluídos: ${estatisticas.desafiosConcluidos}`}>
                <Target className="w-8 h-8 text-purple-600 mb-2" aria-hidden="true" />
                <p className="text-gray-600 mb-1">Desafios Concluídos</p>
                <p className="text-gray-900">{estatisticas.desafiosConcluidos}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6" role="status" aria-label={`Total de horas de estudo: ${estatisticas.horasEstudo} horas`}>
                <BookOpen className="w-8 h-8 text-orange-600 mb-2" aria-hidden="true" />
                <p className="text-gray-600 mb-1">Horas de Estudo</p>
                <p className="text-gray-900">{estatisticas.horasEstudo}h</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6 main-content">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-gray-800">Minhas Turmas</h2>
                    <Link
                      to="/turmas"
                      className="btn-nova-turma flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Nova Turma
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {turmas.map(turma => (
                      <Link
                        key={turma.id}
                        to={`/turma/${turma.id}`}
                        className="block p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
                        aria-label={`Ver detalhes da turma ${turma.nome}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-gray-800">{turma.nome}</h3>
                            <p className="text-gray-600">{turma.alunos} alunos</p>
                          </div>
                          {turma.alertas > 0 && (
                            <div 
                              className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full"
                              role="alert"
                              aria-label={`${turma.alertas} alunos com dificuldade nesta turma`}
                            >
                              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                              <span>{turma.alertas}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex justify-between text-gray-600 mb-2" aria-hidden="true">
                            <span>Meta Semanal</span>
                            <span>{turma.metaSemanal}%</span>
                          </div>
                          <div 
                            className="w-full bg-gray-200 rounded-full h-2"
                            role="progressbar"
                            aria-valuenow={turma.metaSemanal}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Progresso da meta semanal da turma: ${turma.metaSemanal}% atingido`}
                          >
                            <div
                              className={`h-2 rounded-full transition-all ${
                                turma.metaSemanal >= 80 ? 'bg-green-500' : 
                                turma.metaSemanal >= 60 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${turma.metaSemanal}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                    {turmas.length === 0 && (
                      <p className="text-center py-4 text-gray-500">Nenhuma turma para exibir.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/turmas"
                    aria-label="Gerenciar Turmas: Criar e editar turmas"
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-400"
                  >
                    <Users className="w-8 h-8 text-blue-600 mb-2" aria-hidden="true" />
                    <h3 className="text-gray-800 mb-1">Gerenciar Turmas</h3>
                    <p className="text-gray-600">Criar e editar turmas</p>
                  </Link>

                  <Link
                    to="/desplugado"
                    aria-label="Atividades Desplugadas: Gerenciar atividades offline"
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-green-400"
                  >
                    <BookOpen className="w-8 h-8 text-green-600 mb-2" aria-hidden="true" />
                    <h3 className="text-gray-800 mb-1">Atividades Desplugadas</h3>
                    <p className="text-gray-600">Gerenciar atividades offline</p>
                  </Link>
                </div>
              </div>

              <div className="space-y-6 sidebar-container pedagogical-focus">
                <div className="bg-white rounded-xl shadow-lg p-6" role="region" aria-label="Alertas de alunos com dificuldade">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-600" aria-hidden="true" />
                    <h3 className="text-gray-800">Alunos com Dificuldade</h3>
                  </div>
                  <div className="space-y-3">
                    {alunosComDificuldade.map((aluno, idx) => (
                      <Link
                        key={`${aluno.id}-${idx}`}
                        to={`/aluno/${aluno.id}`}
                        aria-label={`Alerta: ${aluno.nome} da turma ${aluno.turma} está com dificuldade no desafio ${aluno.desafio}. Tentou ${aluno.tentativas} vezes.`}
                        className="block p-3 rounded-lg bg-orange-50 border-2 border-orange-200 hover:border-orange-400 transition-all"
                      >
                        <p className="text-gray-800 font-bold">{aluno.nome}</p>
                        <p className="text-gray-600 text-sm">{aluno.turma} • {aluno.desafio}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-orange-700 text-xs font-medium bg-orange-100 px-2 py-0.5 rounded">Dificuldade Detectada</span>
                          <span className="text-gray-600 text-xs">{aluno.tentativas} tentativas</span>
                        </div>
                      </Link>
                    ))}
                    {alunosComDificuldade.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhum aluno com dificuldades no momento! 🎉</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="mb-3">💡 Dica Pedagógica</h3>
                  <p className="text-blue-100">
                    {alunosComDificuldade.length > 0 ? (
                      `Seus alunos estão com dificuldade em "${alunosComDificuldade[0].desafio}". Que tal planejar uma atividade desplugada para reforçar esse conceito?`
                    ) : (
                      "Incentive a colaboração entre os alunos através de desafios em grupo e discussões em sala. Estudos mostram que o aprendizado em grupo melhora a retenção em até 40%!"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
