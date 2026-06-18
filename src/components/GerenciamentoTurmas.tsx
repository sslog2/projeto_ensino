import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Copy, Edit, Trash2, Check, Loader2, Target } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface Turma {
  id: string;
  nome: string;
  codigo: string;
  alunos_count?: number;
  meta_pontos?: number;
  created_at: string;
}

export function GerenciamentoTurmas() {
  const { user } = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nomeTurma, setNomeTurma] = useState('');
  const [metaPontosTurma, setMetaPontosTurma] = useState('500');
  const [copiado, setCopiado] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTurmas();
    }
  }, [user]);

  const fetchTurmas = async () => {
    try {
      setLoading(true);
      
      // Buscar turmas e contar alunos (usando join ou count)
      const { data, error } = await supabase
        .from('turmas')
        .select(`
          *,
          alunos_turmas(count)
        `)
        .eq('professor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const turmasFormatadas = data.map((t: any) => ({
        ...t,
        alunos: t.alunos_turmas[0]?.count || 0
      }));

      setTurmas(turmasFormatadas);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
    } finally {
      setLoading(false);
    }
  };

  const gerarCodigo = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const criarTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setCriando(true);
      const novoCodigo = gerarCodigo();

      const { data, error } = await supabase
        .from('turmas')
        .insert([
          {
            nome: nomeTurma,
            codigo: novoCodigo,
            professor_id: user.id,
            meta_pontos: parseInt(metaPontosTurma) || 500
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setTurmas([data, ...turmas]);
      setMostrarModal(false);
      setNomeTurma('');
      setMetaPontosTurma('500');
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      alert('Erro ao criar turma. Tente novamente.');
    } finally {
      setCriando(false);
    }
  };

  const deletarTurma = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta turma?')) return;

    try {
      const { error } = await supabase
        .from('turmas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTurmas(turmas.filter(t => t.id !== id));
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
    }
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Link to="/dashboard-professor" className="text-gray-600 hover:text-gray-900 flex-shrink-0">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-blue-700 font-bold truncate text-sm sm:text-base md:text-xl">Gerenciamento de Turmas</h1>
                <p className="text-gray-600 text-xs sm:text-sm truncate hidden sm:block">Crie e gerencie suas turmas</p>
              </div>
            </div>
            <button
              onClick={() => setMostrarModal(true)}
              className="btn-nova-turma flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 text-sm"
              title="Nova Turma"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Nova Turma</span>
              <span className="inline sm:hidden">Nova</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turmas.map((turma) => (
              <div key={turma.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-gray-800 mb-1">{turma.nome}</h3>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{(turma as any).alunos || 0} alunos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span>{turma.meta_pontos || 500} pts/aluno</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      onClick={() => deletarTurma(turma.id)}
                      aria-label={`Excluir turma ${turma.nome}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-gray-600 mb-1">Código de Acesso</p>
                  <div className="flex items-center justify-between">
                    <code className="text-blue-600 font-bold">{turma.codigo}</code>
                    <button
                      onClick={() => copiarCodigo(turma.codigo)}
                      className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                      aria-label={`Copiar código da turma ${turma.nome}`}
                    >
                      {copiado === turma.codigo ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Link
                  to={`/turma/${turma.id}`}
                  className="block w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  aria-label={`Ver detalhes da turma ${turma.nome}`}
                >
                  Ver Detalhes
                </Link>
              </div>
            ))}

            {turmas.length === 0 && (
              <div className="col-span-full bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-800 mb-2">Nenhuma turma criada</h3>
                <p className="text-gray-600 mb-6">Comece criando sua primeira turma para gerenciar seus alunos.</p>
                <button
                  onClick={() => setMostrarModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Criar minha primeira turma
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Nova Turma */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-gray-800 mb-6">Criar Nova Turma</h2>
            
            <form onSubmit={criarTurma} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nome da Turma</label>
                <input
                  type="text"
                  value={nomeTurma}
                  onChange={(e) => setNomeTurma(e.target.value)}
                  placeholder="Ex: 7º Ano A"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Meta de Pontos (por aluno)</label>
                <input
                  type="number"
                  value={metaPontosTurma}
                  onChange={(e) => setMetaPontosTurma(e.target.value)}
                  placeholder="500"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  min="100"
                  required
                />
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 mb-2">ℹ️ Código de acesso</p>
                <p className="text-blue-700 text-sm">
                  Um código único de 6 caracteres será gerado para que seus alunos possam entrar na turma.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModal(false);
                    setNomeTurma('');
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={criando}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {criando ? 'Criando...' : 'Criar Turma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

