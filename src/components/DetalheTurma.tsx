import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, TrendingDown, AlertTriangle, Trophy, Target, Loader2, Star } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export function DetalheTurma() {
  const { id } = useParams();
  const { user } = useAuth();
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'pontos' | 'progresso'>('pontos');
  
  const [loading, setLoading] = useState(true);
  const [turma, setTurma] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);

  useEffect(() => {
    if (id && user) {
      fetchDetalhesTurma();
    }
  }, [id, user]);

  const fetchDetalhesTurma = async () => {
    try {
      setLoading(true);

      // 1. Buscar detalhes da turma (garantindo que pertence ao professor)
      const { data: turmaData, error: turmaError } = await supabase
        .from('turmas')
        .select('*')
        .eq('id', id)
        .eq('professor_id', user?.id)
        .single();

      if (turmaError) throw turmaError;
      setTurma(turmaData);

      // 2. Buscar alunos matriculados nesta turma
      const { data: alunosData, error: alunosError } = await supabase
        .from('alunos_turmas')
        .select(`
          aluno_id,
          profiles:aluno_id (
            id, nome, nivel, pontos, avatar_data
          )
        `)
        .eq('turma_id', id);

      if (alunosError) throw alunosError;

      // 3. Buscar total de desafios
      const { count: totalDesafios } = await supabase
        .from('desafios')
        .select('*', { count: 'exact', head: true });

      const totalD = totalDesafios || 1;

      // 4. Buscar progresso real dos alunos desta turma
      const idsAlunos = (alunosData || []).map((a: any) => a.aluno_id);
      const { data: progressoData } = await supabase
        .from('progresso_alunos')
        .select('aluno_id, concluido, tentativas')
        .in('aluno_id', idsAlunos);

      const alunosFormatados = (alunosData || []).map((a: any) => {
        const perfil = a.profiles;
        const progressoAluno = (progressoData || []).filter(p => p.aluno_id === perfil.id);
        
        const concluidos = progressoAluno.filter(p => p.concluido).length;
        const progressoReal = Math.min(100, Math.round((concluidos / totalD) * 100));
        
        // Alerta Real: Mais de 3 tentativas em qualquer desafio não concluído
        const temDificuldade = progressoAluno.some(p => !p.concluido && p.tentativas > 3);
        
        return {
          id: perfil.id,
          nome: perfil.nome,
          nivel: perfil.nivel || 1,
          pontos: perfil.pontos || 0,
          progresso: progressoReal,
          ultimoAcesso: 'Ativo recentemente', // Simulado
          desafiosConcluidos: concluidos,
          tendencia: 'stable', // Simulado
          alertas: temDificuldade ? 1 : 0,
          alertasMotivo: temDificuldade ? 'Dificuldade detectada (> 3 tentativas)' : '',
          avatar: perfil.avatar_data?.corpo || 'basic'
        };
      });

      setAlunos(alunosFormatados);

    } catch (error) {
      console.error('Erro ao buscar detalhes da turma:', error);
    } finally {
      setLoading(false);
    }
  };

  const alunosFiltrados = alunos
    .filter(aluno => aluno.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => {
      if (ordenacao === 'nome') return a.nome.localeCompare(b.nome);
      if (ordenacao === 'pontos') return b.pontos - a.pontos;
      if (ordenacao === 'progresso') return b.progresso - a.progresso;
      return 0;
    });

  const pontosTotaisDaTurma = alunos.reduce((acc, a) => acc + a.pontos, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!turma) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 text-gray-600">
        Turma não encontrada ou você não tem permissão para acessá-la.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/turmas" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-blue-700">{turma.nome}</h1>
              <p className="text-gray-600 font-medium">
                {alunos.length} alunos matriculados • Código de Acesso: <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">{turma.codigo}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Cards de Estatísticas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Target className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-gray-600 mb-1">Meta Coletiva</p>
            <p className="text-gray-900 font-bold">{(turma?.meta_pontos || 500) * alunos.length} pts</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-b-4 border-yellow-400">
            <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-gray-600 mb-1">Pontos Total Arrecadados</p>
            <p className="text-gray-900 font-bold text-2xl">{pontosTotaisDaTurma}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-gray-600 mb-1">Média de Progresso</p>
            <p className="text-gray-900 font-bold">
              {alunos.length > 0 ? Math.round(alunos.reduce((acc, a) => acc + a.progresso, 0) / alunos.length) : 0}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <AlertTriangle className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-gray-600 mb-1">Alertas (Estimativa)</p>
            <p className="text-gray-900 font-bold text-red-600">{alunos.filter(a => a.alertas > 0).length} alunos</p>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar aluno por nome..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as any)}
                className="w-full md:w-auto px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              >
                <option value="pontos">Ordenar por Pontos (Maior primeiro)</option>
                <option value="progresso">Ordenar por Progresso</option>
                <option value="nome">Ordenar de A a Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Alunos */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-700 font-semibold uppercase text-xs tracking-wider">Aluno</th>
                  <th className="px-6 py-4 text-center text-gray-700 font-semibold uppercase text-xs tracking-wider">Nível</th>
                  <th className="px-6 py-4 text-right text-gray-700 font-semibold uppercase text-xs tracking-wider">Pontos</th>
                  <th className="px-6 py-4 text-left text-gray-700 font-semibold uppercase text-xs tracking-wider">Progresso Est.</th>
                  <th className="px-6 py-4 text-center text-gray-700 font-semibold uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-gray-700 font-semibold uppercase text-xs tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alunosFiltrados.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <AvatarEvolutivo nivel={aluno.nivel} tipo={aluno.avatar} tamanho="sm" />
                        <div>
                          <p className="text-gray-900 font-medium">{aluno.nome}</p>
                          {aluno.alertas > 0 && (
                            <div className="flex items-center gap-1 text-orange-600 mt-1" title={aluno.alertasMotivo}>
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">{aluno.alertasMotivo || `${aluno.alertas} alerta(s) de atenção`}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{aluno.nivel}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold text-gray-900">{aluno.pontos}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs font-medium text-gray-600 mb-1.5">
                          <span>Estimativa</span>
                          <span>{aluno.progresso}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              aluno.progresso >= 70 ? 'bg-green-500' :
                              aluno.progresso >= 40 ? 'bg-yellow-400' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${aluno.progresso}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {aluno.alertas > 0 ? (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full uppercase tracking-wide">
                          Atenção
                        </span>
                      ) : aluno.progresso >= 70 ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wide">
                          Ótimo
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wide">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/aluno/${aluno.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        Relatório Completo
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {alunosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic bg-gray-50">
                      Nenhum aluno encontrado nesta turma. Compartilhe o código <span className="font-bold text-blue-600">{turma.codigo}</span> com eles!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
