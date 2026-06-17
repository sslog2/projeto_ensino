import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2, AlertTriangle } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { calcularProgressoNivel } from '../utils/leveling';

export function RelatorioAluno() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'semana' | 'mes' | 'total'>('semana');
  const [loading, setLoading] = useState(true);
  const [alunoInfo, setAlunoInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [historicoTentativas, setHistoricoTentativas] = useState<any[]>([]);
  const [estatisticas, setEstatisticas] = useState({
    desafiosConcluidos: 0,
    totalDesafios: 0,
    horasEstudo: 0,
    taxaSucesso: 0
  });

  useEffect(() => {
    if (id) {
      fetchDadosAluno();
    }
  }, [id]);

  const fetchDadosAluno = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Buscar Perfil do Aluno e sua Turma (dados básicos garantidos)
      const { data: perfilData, error: perfilError } = await supabase
        .from('profiles')
        .select(`
          id, nome, nivel, pontos, avatar_data,
          alunos_turmas(turma_id, turmas(id, nome))
        `)
        .eq('id', id)
        .single();

      if (perfilError) {
        setError(`Erro ao buscar perfil: ${perfilError.message}`);
        throw perfilError;
      }

      // 1.1 Tentar buscar campos adicionais separadamente
      let emailReal = '';
      let necessidades = false;
      let dataInscricaoStr = 'N/A';
      try {
        const { data: extraData } = await supabase
          .from('profiles')
          .select('email, necessidades_cognitivas, created_at')
          .eq('id', id)
          .single();
        if (extraData) {
          emailReal = (extraData as any).email || '';
          necessidades = !!(extraData as any).necessidades_cognitivas;
          if ((extraData as any).created_at) {
             dataInscricaoStr = new Date((extraData as any).created_at).toLocaleDateString('pt-BR');
          }
        }
      } catch (e) {
        console.warn('Colunas extras não disponíveis.');
      }
      
      const turmaInfo = perfilData.alunos_turmas?.[0]?.turmas || { nome: 'Sem Turma', id: '' };
      
      setAlunoInfo({
        ...perfilData,
        email: emailReal,
        turmaNome: turmaInfo.nome,
        turmaId: turmaInfo.id,
        avatar: perfilData.avatar_data?.corpo || 'basic',
        dataInscricao: dataInscricaoStr,
        necessidades_cognitivas: necessidades
      });

      // 2. Buscar Histórico de Progresso
      const { data: progressoData, error: progressoError } = await supabase
        .from('progresso_alunos')
        .select(`
          id, concluido, pontuacao_obtida, data_conclusao, tentativas,
          desafios(titulo, dificuldade)
        `)
        .eq('aluno_id', id)
        .order('id', { ascending: false }); // Ordenar por ID para garantir que falhas recentes apareçam

      if (progressoError) console.error('Erro no progresso:', progressoError);

      // 3. Buscar total de desafios
      const { count: totalDesafios } = await supabase
        .from('desafios')
        .select('*', { count: 'exact', head: true });

      const formatados = (progressoData || []).map(p => ({
        id: p.id,
        desafio: p.desafios?.titulo || 'Desafio',
        dificuldade: p.desafios?.dificuldade || 'Média',
        data: p.data_conclusao ? new Date(p.data_conclusao).toLocaleDateString('pt-BR') : 'Tentativa Recente',
        sucesso: p.concluido,
        pontos: p.pontuacao_obtida,
        tentativas: p.tentativas || 1
      }));

      setHistoricoTentativas(formatados);

      const concluidos = formatados.filter(p => p.sucesso).length;
      const taxa = formatados.length > 0 ? Math.round((concluidos / formatados.length) * 100) : 0;

      setEstatisticas({
        desafiosConcluidos: concluidos,
        totalDesafios: totalDesafios || 0,
        horasEstudo: formatados.reduce((acc, curr) => acc + (curr.tentativas || 1), 0) * 0.1, // 6 min por tentativa
        taxaSucesso: taxa
      });

    } catch (error: any) {
      console.error('Erro ao buscar dados do aluno:', error);
      if (!error) setError(error.message || 'Erro desconhecido ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const toggleNecessidade = async () => {
    if (!alunoInfo) return;
    
    try {
      const novaNecessidade = !alunoInfo.necessidades_cognitivas;
      const { error } = await supabase
        .from('profiles')
        .update({ necessidades_cognitivas: novaNecessidade })
        .eq('id', alunoInfo.id)
        .select()
        .single();

      if (error) {
        alert(`Erro ao salvar no banco (Possível bloqueio de permissão RLS): ${error.message}`);
        throw error;
      }

      setAlunoInfo({
        ...alunoInfo,
        necessidades_cognitivas: novaNecessidade
      });
    } catch (err: any) {
      console.error('Erro ao atualizar tag de necessidade:', err);
      // Se não foi um erro já alertado acima, alerta agora
      if (!err.message?.includes('salvar')) {
         alert(`Erro ao atualizar tag: ${err.message || 'Erro desconhecido'}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !alunoInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-gray-800 font-bold mb-2">Aluno não encontrado</h2>
        <p className="text-gray-600 mb-6">{error || 'Verifique se o ID do aluno está correto ou se ele ainda faz parte da sua turma.'}</p>
        <Link to="/dashboard-professor" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to={alunoInfo.turmaId ? `/turma/${alunoInfo.turmaId}` : '/dashboard-professor'} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-blue-700">Relatório do Aluno</h1>
              <p className="text-gray-600">{alunoInfo.turmaNome}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Perfil do Aluno */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-6 mb-6">
                <AvatarEvolutivo nivel={alunoInfo.nivel} tipo={alunoInfo.avatar} tamanho="lg" />
                <div className="flex-1">
                  <h2 className="text-gray-800 mb-1">{alunoInfo.nome}</h2>
                  <p className="text-gray-600 mb-2">{alunoInfo.email || 'Email oculto'}</p>
                  <div className="flex items-center gap-4 text-gray-600 font-medium">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Nível {alunoInfo.nivel}</span>
                    <span>•</span>
                    <span className="text-yellow-600">{alunoInfo.pontos} pts</span>
                    <span>•</span>
                    <span className="text-sm">Desde {alunoInfo.dataInscricao}</span>
                  </div>

                  <div className="mt-3 max-w-xs">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progresso do Nível</span>
                      <span>{calcularProgressoNivel(alunoInfo.pontos || 0).porcentagem}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${calcularProgressoNivel(alunoInfo.pontos || 0).porcentagem}%` }} 
                      />
                    </div>
                  </div>
                  
                  {currentUser?.tipo === 'professor' && (
                    <div className="mt-4">
                      <button
                        onClick={toggleNecessidade}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border-2 ${
                          alunoInfo.necessidades_cognitivas
                            ? 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-pressed={alunoInfo.necessidades_cognitivas}
                        aria-label="Alternar status de apoio cognitivo especial para este aluno"
                      >
                        <div className={`w-3 h-3 rounded-full ${alunoInfo.necessidades_cognitivas ? 'bg-purple-600' : 'bg-gray-400'}`} />
                        Apoio Cognitivo Especial
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Ativar esta tag libera recursos como o "Preview de Algoritmo" no editor de blocos.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-1 text-sm">Concluídos</p>
                  <p className="text-gray-900 font-bold text-xl">{estatisticas.desafiosConcluidos}/{estatisticas.totalDesafios}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-1 text-sm">Tempo (Est.)</p>
                  <p className="text-gray-900 font-bold text-xl">{estatisticas.horasEstudo.toFixed(1)}h</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-1 text-sm">Taxa Sucesso</p>
                  <p className="text-gray-900 font-bold text-xl">{estatisticas.taxaSucesso}%</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-1 text-sm">Sequência</p>
                  <p className="text-gray-900 font-bold text-xl">0 dias</p>
                </div>
              </div>
            </div>

            {/* Histórico de Tentativas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Histórico Recente</h3>
              <div className="space-y-3">
                {historicoTentativas.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 ${
                      item.sucesso ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-gray-800 mb-1 font-bold">{item.desafio}</h4>
                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {item.data}
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-xs font-medium">
                            {item.dificuldade}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          item.sucesso 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-orange-200 text-orange-800'
                        }`}>
                          {item.sucesso ? '✓ Concluído' : '✗ Tentou'}
                        </span>
                        {item.pontos > 0 && (
                          <p className="text-yellow-600 mt-2 font-bold text-sm">+{item.pontos} pts</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {historicoTentativas.length === 0 && (
                  <p className="text-center py-8 text-gray-500 italic">Nenhum desafio registrado ainda.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
          </div>
        </div>
      </div>
    </div>
  );
}
