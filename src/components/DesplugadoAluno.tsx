import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Calendar as CalendarIcon, Users, Paperclip, Loader2, BookOpen, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

export function DesplugadoAluno() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [inscricoes, setInscricoes] = useState<string[]>([]);
  const [turmaId, setTurmaId] = useState<string | null>(null);
  const [recursosLinks, setRecursosLinks] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAtividades();
    }
  }, [user]);

  const fetchAtividades = async () => {
    try {
      setLoading(true);

      // 1. Obter a turma do aluno
      const { data: vinculo, error: vinculoError } = await supabase
        .from('alunos_turmas')
        .select('turma_id')
        .eq('aluno_id', user?.id)
        .single();

      if (vinculoError && vinculoError.code !== 'PGRST116') throw vinculoError;
      
      const userTurmaId = vinculo?.turma_id;
      setTurmaId(userTurmaId || null);

      if (userTurmaId) {
        // Buscar professor_id para obter recursos
        const { data: turmaData } = await supabase
          .from('turmas')
          .select('professor_id')
          .eq('id', userTurmaId)
          .single();

        if (turmaData?.professor_id) {
          const { data: recursosData } = await supabase
            .from('recursos_desplugados')
            .select('*')
            .eq('professor_id', turmaData.professor_id)
            .order('created_at', { ascending: false });
            
          setRecursosLinks(recursosData || []);
        }

        // 2. Buscar atividades para esta turma
        const { data: atividadesData, error: atividadesError } = await supabase
          .from('atividades_desplugadas')
          .select(`*`)
          .eq('turma_id', userTurmaId)
          .order('data_criacao', { ascending: false });

        if (atividadesError) {
          console.error("Erro SQL ao buscar atividades_desplugadas:", atividadesError);
          throw atividadesError;
        }
        
        console.log("Atividades brutas vindas do banco:", atividadesData);
        console.log("Turma do aluno:", userTurmaId);
        
        // Filtra as não concluídas em memória (ajuda caso o banco tenha salvo como NULL em vez de false)
        const ativas = (atividadesData || []).filter(a => !a.concluida);
        setAtividades(ativas);

        // 3. Buscar inscrições atuais do aluno
        const { data: inscricoesData, error: inscricoesError } = await supabase
          .from('inscricoes_atividades')
          .select('atividade_id')
          .eq('aluno_id', user?.id);

        if (!inscricoesError && inscricoesData) {
          setInscricoes(inscricoesData.map(i => i.atividade_id));
        }
      }
    } catch (err) {
      console.error('Erro ao buscar atividades desplugadas:', err);
    } finally {
      setLoading(false);
    }
  };

  const inscrever = async (atividadeId: string) => {
    try {
      const { error } = await supabase
        .from('inscricoes_atividades')
        .insert([{
          atividade_id: atividadeId,
          aluno_id: user?.id
        }]);

      if (error) {
        alert('Erro ao se inscrever na atividade. Verifique as permissões do banco.');
        throw error;
      }
      
      setInscricoes([...inscricoes, atividadeId]);
    } catch (err) {
      console.error('Erro ao se inscrever:', err);
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard-aluno" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-purple-700">Atividades Desplugadas</h1>
              <p className="text-gray-600">Participe de atividades práticas offline com a sua turma</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!turmaId ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500">Você precisa estar vinculado a uma turma para ver atividades e materiais de apoio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Coluna de Atividades (Esquerda) */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-gray-800 text-xl font-bold mb-4">Atividades Disponíveis</h2>
              
              {atividades.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-700 text-lg mb-2">Nenhuma atividade ativa</h3>
                  <p className="text-gray-500">Seu professor ainda não publicou nenhuma atividade desplugada.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {atividades.map((atividade) => {
                    const inscrito = inscricoes.includes(atividade.id);
                    
                    return (
                      <div key={atividade.id} className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all ${
                        inscrito ? 'border-purple-300' : 'border-transparent hover:border-purple-200'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-gray-800 mb-2">{atividade.titulo}</h3>
                            <p className="text-gray-600 mb-4">{atividade.descricao}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                              {atividade.data_agendada && (
                                 <span className="flex items-center gap-1 text-purple-600 font-medium">
                                   <CalendarIcon className="w-4 h-4" />
                                   {new Date(atividade.data_agendada).toLocaleDateString()}
                                 </span>
                              )}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                              <p className="text-gray-700 font-medium mb-1">📦 Materiais:</p>
                              <p className="text-gray-600">{atividade.materiais || 'Nenhum material especificado'}</p>
                            </div>

                            {inscrito && atividade.anexo_url && (
                              <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                  <span className="truncate max-w-[200px]" title="Documento Anexo">
                                    {(() => {
                                      const rawName = decodeURIComponent(atividade.anexo_url.split('/').pop() || '');
                                      return rawName.includes('-') ? rawName.substring(rawName.indexOf('-') + 1) : (rawName || 'Documento Anexo');
                                    })()}
                                  </span>
                                </p>
                                <a 
                                  href={atividade.anexo_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                                >
                                  <Paperclip className="w-4 h-4" />
                                  Baixar Material de Apoio
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 flex justify-end">
                          {inscrito ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-bold">
                              <CheckCircle className="w-5 h-5" />
                              Inscrito Confirmado
                            </span>
                          ) : (
                            <button
                              onClick={() => inscrever(atividade.id)}
                              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                            >
                              Inscrever-se na Atividade
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Coluna de Recursos (Direita) */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-gray-800 mb-4 flex items-center gap-2">
                  📚 Recursos Adicionais
                </h3>
                <div className="space-y-3">
                  {recursosLinks.map((recurso) => (
                    <a 
                      key={recurso.id} 
                      href={recurso.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-200 group"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <FileText className="w-4 h-4 text-blue-700" />
                      </div>
                      <span className="text-gray-700 font-medium group-hover:text-blue-800 transition-colors">
                        {recurso.titulo}
                      </span>
                    </a>
                  ))}
                  {recursosLinks.length === 0 && (
                    <p className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">
                      Seu professor ainda não adicionou nenhum material extra.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}