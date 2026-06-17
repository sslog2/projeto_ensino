import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Trophy, Star, TrendingUp, Medal, Target, Loader2 } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';
import { supabase } from '../supabaseClient';
import { calcularNivel } from '../utils/leveling';

export function RankingTurma() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState<any[]>([]);
  const [turmaInfo, setTurmaInfo] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchRanking();
    }
  }, [user]);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      
      const { data: vinculo, error: errorVinculo } = await supabase
        .from('alunos_turmas')
        .select('turma_id, turmas(nome)')
        .eq('aluno_id', user?.id)
        .single();

      if (errorVinculo || !vinculo) throw errorVinculo || new Error('Aluno sem turma');
      setTurmaInfo(vinculo.turmas);

      const { data: alunos, error: errorAlunos } = await supabase
        .from('alunos_turmas')
        .select(`
          aluno_id,
          profiles:aluno_id (
            id,
            nome,
            pontos,
            nivel,
            avatar_data
          )
        `)
        .eq('turma_id', vinculo.turma_id);

      if (errorAlunos) throw errorAlunos;

      const r = (alunos || [])
        .map((a: any) => ({
          id: a.profiles.id,
          nome: a.profiles.nome,
          pontos: a.profiles.pontos || 0,
          nivel: calcularNivel(a.profiles.pontos || 0), // Calcula na hora
          avatar: a.profiles.avatar_data?.corpo || 'basic',
          euSou: a.profiles.id === user?.id
        }))
        .sort((a, b) => b.pontos - a.pontos)
        .map((a, index) => ({ ...a, posicao: index + 1 }));

      setRanking(r);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPosicaoCor = (posicao: number) => {
    if (posicao === 1) return 'from-yellow-400 to-orange-500';
    if (posicao === 2) return 'from-gray-400 to-gray-600';
    if (posicao === 3) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  const getPosicaoIcone = (posicao: number) => {
    if (posicao === 1) return '🥇';
    if (posicao === 2) return '🥈';
    if (posicao === 3) return '🥉';
    return posicao;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  const minhaPosicao = ranking.find(a => a.euSou);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard-aluno" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-purple-700">Ranking da Turma</h1>
              <p className="text-gray-600">{turmaInfo?.nome || 'Minha Turma'} - Competição amigável</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {ranking.length >= 3 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-gray-800 mb-6">Top 3 do Ranking</h2>
                <div className="flex items-end justify-center gap-4 mb-8">
                  <div className="flex-1 text-center">
                    <div className="flex justify-center mb-2">
                      <AvatarEvolutivo nivel={ranking[1].nivel} tipo={ranking[1].avatar} tamanho="md" />
                    </div>
                    <div className="bg-gradient-to-br from-gray-400 to-gray-600 text-white rounded-lg p-4 h-36 flex flex-col justify-end">
                      <p className="text-3xl mb-1">🥈</p>
                      <p className="text-white truncate font-bold">{ranking[1].nome.split(' ')[0]}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-current text-yellow-300" />
                        <span>{ranking[1].pontos}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="flex justify-center mb-2">
                      <AvatarEvolutivo nivel={ranking[0].nivel} tipo={ranking[0].avatar} tamanho="md" />
                    </div>
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-lg p-4 h-48 flex flex-col justify-end shadow-lg ring-4 ring-yellow-200">
                      <p className="text-4xl mb-1">🥇</p>
                      <p className="text-white truncate font-bold text-lg">{ranking[0].nome.split(' ')[0]}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Star className="w-5 h-5 fill-current text-yellow-300" />
                        <span className="font-bold">{ranking[0].pontos}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="flex justify-center mb-2">
                      <AvatarEvolutivo nivel={ranking[2].nivel} tipo={ranking[2].avatar} tamanho="md" />
                    </div>
                    <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-lg p-4 h-32 flex flex-col justify-end">
                      <p className="text-3xl mb-1">🥉</p>
                      <p className="text-white truncate font-bold">{ranking[2].nome.split(' ')[0]}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-current text-yellow-300" />
                        <span>{ranking[2].pontos}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-gray-800 mb-4">Ranking Completo</h2>
              <div className="space-y-3">
                {ranking.map((aluno) => (
                  <div
                    key={aluno.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      aluno.euSou
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-400'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getPosicaoCor(aluno.posicao)} flex items-center justify-center text-white flex-shrink-0 shadow-sm font-bold`}>
                      {getPosicaoIcone(aluno.posicao)}
                    </div>
                    <div className="flex-shrink-0">
                      <AvatarEvolutivo nivel={aluno.nivel} tipo={aluno.avatar} tamanho="sm" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800 font-bold">{aluno.nome}</p>
                        {aluno.euSou && (
                          <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] uppercase font-black rounded-full tracking-wider">Você</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-tight">Nível {aluno.nivel}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-yellow-600 justify-end">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="text-gray-900 font-black text-lg">{aluno.pontos}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {ranking.length === 0 && (
                  <p className="text-center py-12 text-gray-400 italic">Ainda não há outros alunos nesta turma.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h3 className="mb-4 font-bold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-300" />
                Sua Posição
              </h3>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">Posição Atual</span>
                  <span className="text-3xl font-black">{minhaPosicao?.posicao || '-'}º</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Total de Pontos</span>
                  <span className="font-bold text-xl">{minhaPosicao?.pontos || 0}</span>
                </div>
              </div>
              <p className="text-blue-100 text-sm italic leading-relaxed">
                {minhaPosicao?.posicao === 1 
                  ? 'Você é a lenda da turma! Defenda seu trono! 👑' 
                  : 'Continue praticando para subir no pódio! 🚀'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-yellow-400">
              <h3 className="text-gray-800 mb-3 font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Dica de Mestre
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sabia que resolver desafios sem errar nenhum comando te dá um bônus de pontos?
                Pense bem antes de clicar em "Executar"!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
