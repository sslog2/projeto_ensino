import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Trophy, Star, Target, TrendingUp, Loader2 } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';
import { supabase } from '../supabaseClient';
import { calcularProgressoNivel } from '../utils/leveling';

export function PerfilAluno() {
  const { user, atualizarUsuario } = useAuth();
  const [avatarSelecionado, setAvatarSelecionado] = useState(user?.avatar?.corpo || 'basic');
  const [loading, setLoading] = useState(true);
  const [conquistas, setConquistas] = useState<any[]>([]);
  const [estatisticas, setEstatisticas] = useState({
    desafiosConcluidos: 0,
    totalDesafios: 0,
    horasEstudo: 0,
    tentativasMedia: 0,
    sequenciaDias: 0,
    rankingPosicao: 0,
    totalAlunos: 0
  });

  useEffect(() => {
    if (user) {
      fetchEstatisticas();
    }
  }, [user]);

  const fetchEstatisticas = async () => {
    try {
      setLoading(true);
      
      // 1. Total de Desafios
      const { count: totalDesafios } = await supabase
        .from('desafios')
        .select('*', { count: 'exact', head: true });

      // 2. Progresso do Aluno
      const { data: progressoData } = await supabase
        .from('progresso_alunos')
        .select('*')
        .eq('aluno_id', user?.id);

      const listaProgresso = progressoData || [];
      const concluidos = listaProgresso.filter(p => p.concluido).length;
      const totalTentativas = listaProgresso.reduce((acc, p) => acc + (p.tentativas || 0), 0);
      const mediaTentativas = listaProgresso.length > 0 
        ? Number((totalTentativas / listaProgresso.length).toFixed(1)) 
        : 0;
      
      const totalEstrelas = listaProgresso.reduce((acc, p) => acc + (p.estrelas_obtidas || 0), 0);
      const melhorTempo = Math.min(...listaProgresso.filter(p => p.tempo_segundos).map(p => p.tempo_segundos)) || 999;

      // 3. Calcular Sequência (Streak)
      let s = 0;
      if (listaProgresso.length > 0) {
        const uniqueDays = [...new Set(listaProgresso
          .map(p => p.data_conclusao ? p.data_conclusao.split('T')[0] : null)
          .filter(d => d !== null)
        )].sort((a, b) => b!.localeCompare(a!));
        
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
      }

      // 4. Lógica Funcional de Conquistas
      const listaConquistas = [
        { id: 1, titulo: 'Primeira Vitória', descricao: 'Conclua seu primeiro desafio', icone: '🏆', desbloqueado: concluidos >= 1 },
        { id: 2, titulo: 'Veloz como um Raio', descricao: 'Termine um desafio em menos de 15s', icone: '⚡', desbloqueado: melhorTempo <= 15 },
        { id: 3, titulo: 'Céu Estrelado', descricao: 'Colete 10 estrelas no total', icone: '⭐', desbloqueado: totalEstrelas >= 10 },
        { id: 4, titulo: 'Persistente', descricao: 'Tente um desafio mais de 5 vezes', icone: '🔥', desbloqueado: listaProgresso.some(p => p.tentativas >= 5) },
        { id: 5, titulo: 'Perfeccionista', descricao: 'Consiga 3 estrelas em um desafio', icone: '✨', desbloqueado: listaProgresso.some(p => p.estrelas_obtidas >= 3) },
        { id: 6, titulo: 'Explorador', descricao: 'Conclua 5 desafios diferentes', icone: '🗺️', desbloqueado: concluidos >= 5 },
        { id: 7, titulo: 'Colecionador', descricao: 'Acumule mais de 1000 pontos', icone: '💰', desbloqueado: (user?.pontos || 0) >= 1000 },
        { id: 8, titulo: 'Veterano', descricao: 'Chegue ao nível 10', icone: '🎖️', desbloqueado: (user?.nivel || 0) >= 10 },
        { id: 9, titulo: 'Mestre da Lógica', descricao: 'Conclua 10 desafios no total', icone: '🧠', desbloqueado: concluidos >= 10 },
      ];
      setConquistas(listaConquistas);

      // 5. Ranking e Total de Alunos
      const { data: vinculo } = await supabase
        .from('alunos_turmas')
        .select('turma_id')
        .eq('aluno_id', user?.id)
        .single();

      let ranking = 0;
      let totalTurma = 0;

      if (vinculo) {
        const { data: alunos } = await supabase
          .from('alunos_turmas')
          .select(`
            aluno_id,
            profiles:aluno_id (pontos)
          `)
          .eq('turma_id', vinculo.turma_id);

        if (alunos) {
          totalTurma = alunos.length;
          const ordenados = (alunos || [])
            .map((a: any) => ({
              id: a.aluno_id,
              pontos: a.profiles.pontos || 0
            }))
            .sort((a, b) => b.pontos - a.pontos);
          
          ranking = ordenados.findIndex(a => a.id === user?.id) + 1;
        }
      }

      setEstatisticas({
        desafiosConcluidos: concluidos,
        totalDesafios: totalDesafios || 0,
        horasEstudo: Number((totalTentativas * 0.1).toFixed(1)),
        tentativasMedia: mediaTentativas,
        sequenciaDias: s,
        rankingPosicao: ranking,
        totalAlunos: totalTurma
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const salvarAvatar = () => {
    if (user) {
      atualizarUsuario({
        avatar: {
          ...user.avatar,
          corpo: avatarSelecionado
        } as any
      });
    }
  };

  const opcoesAvatar = [
    { id: 'basic', nome: 'Básico', nivel: 1, desbloqueado: true },
    { id: 'warrior', nome: 'Guerreiro', nivel: 5, desbloqueado: (user?.nivel || 0) >= 5 },
    { id: 'mage', nome: 'Mago', nivel: 10, desbloqueado: (user?.nivel || 0) >= 10 },
    { id: 'dragon', nome: 'Dragão', nivel: 15, desbloqueado: (user?.nivel || 0) >= 15 },
  ];

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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard-aluno" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-purple-700">Meu Perfil</h1>
              <p className="text-gray-600">Visualize e personalize seu perfil</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personalização do Avatar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-gray-800 mb-6">Personalize seu Avatar</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {opcoesAvatar.map((opcao) => (
                  <button
                    key={opcao.id}
                    onClick={() => opcao.desbloqueado && setAvatarSelecionado(opcao.id)}
                    disabled={!opcao.desbloqueado}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      avatarSelecionado === opcao.id
                        ? 'border-purple-600 bg-purple-50'
                        : opcao.desbloqueado
                        ? 'border-gray-200 hover:border-purple-300'
                        : 'border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <AvatarEvolutivo nivel={opcao.nivel} tipo={opcao.id} tamanho="sm" />
                    </div>
                    <p className="text-gray-800 text-center">{opcao.nome}</p>
                    {!opcao.desbloqueado && (
                      <p className="text-gray-600 text-center mt-1">Nível {opcao.nivel}</p>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={salvarAvatar}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Salvar Avatar
              </button>
            </div>

            {/* Conquistas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-gray-800 mb-6">Conquistas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conquistas.map((conquista) => (
                  <div
                    key={conquista.id}
                    className={`p-4 rounded-lg border-2 ${
                      conquista.desbloqueado
                        ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{conquista.icone}</div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 mb-1">{conquista.titulo}</h3>
                        <p className="text-gray-600">{conquista.descricao}</p>
                        {conquista.desbloqueado && conquista.data && (
                          <p className="text-gray-500 mt-2">{conquista.data}</p>
                        )}
                      </div>
                      {conquista.desbloqueado && (
                        <Trophy className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card do Perfil */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <AvatarEvolutivo nivel={user?.nivel || 1} tipo={avatarSelecionado} />
              <h2 className="text-gray-800 mt-4">{user?.nome}</h2>
              <p className="text-gray-600">Nível {user?.nivel || 1}</p>
              
              <div className="flex items-center justify-center gap-2 mt-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-gray-700">{user?.pontos || 0} pontos</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progresso do Nível</span>
                  <span>{calcularProgressoNivel(user?.pontos || 0).porcentagem}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${calcularProgressoNivel(user?.pontos || 0).porcentagem}%` }} 
                  />
                </div>
                <p className="text-xs text-gray-500 italic">
                  Faltam {calcularProgressoNivel(user?.pontos || 0).pontosRestantes} pontos para o nível {(user?.nivel || 1) + 1}
                </p>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Estatísticas</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Desafios</span>
                  </div>
                  <span className="text-gray-900">{estatisticas.desafiosConcluidos}/{estatisticas.totalDesafios}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Horas de Estudo</span>
                  </div>
                  <span className="text-gray-900">{estatisticas.horasEstudo}h</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <span className="text-gray-700">Sequência</span>
                  </div>
                  <span className="text-gray-900">{estatisticas.sequenciaDias} dias</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">Ranking</span>
                  </div>
                  <span className="text-gray-900">{estatisticas.rankingPosicao}º/{estatisticas.totalAlunos}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <span className="text-gray-700">Média de Tentativas</span>
                  </div>
                  <span className="text-gray-900">{estatisticas.tentativasMedia}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
