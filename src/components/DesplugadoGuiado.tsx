import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, Clock, Users, FileText, Edit, Trash2, Loader2, Paperclip, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

export function DesplugadoGuiado() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tituloAtividade, setTituloAtividade] = useState('');
  const [descricaoAtividade, setDescricaoAtividade] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [materiaisAtividade, setMateriaisAtividade] = useState('');
  const [dataAgendadaAtividade, setDataAgendadaAtividade] = useState('');
  const [arquivoAnexo, setArquivoAnexo] = useState<File | null>(null);
  const [abaSelecionada, setAbaSelecionada] = useState<'ativas' | 'concluidas'>('ativas');
  const [turmas, setTurmas] = useState<any[]>([]);

  const [atividades, setAtividades] = useState<any[]>([]);
  
  // Estado dos links de recursos
  const [recursosLinks, setRecursosLinks] = useState<any[]>([]);
  const [novoRecursoTitulo, setNovoRecursoTitulo] = useState('');
  const [novoRecursoUrl, setNovoRecursoUrl] = useState('');

  useEffect(() => {
    if (user) {
      fetchTurmas();
      fetchAtividades();
      fetchRecursos();
    }
  }, [user]);

  const fetchRecursos = async () => {
    try {
      const { data, error } = await supabase
        .from('recursos_desplugados')
        .select('*')
        .eq('professor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') throw error;
      setRecursosLinks(data || []);
    } catch (err) {
      console.error('Erro ao buscar recursos:', err);
    }
  };

  const adicionarRecurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoRecursoTitulo || !novoRecursoUrl) return;
    
    try {
      const { error } = await supabase
        .from('recursos_desplugados')
        .insert([{
          professor_id: user?.id,
          titulo: novoRecursoTitulo,
          url: novoRecursoUrl
        }]);

      if (error) {
        alert('Erro ao adicionar recurso. Verifique as permissões do banco.');
        throw error;
      }
      
      setNovoRecursoTitulo('');
      setNovoRecursoUrl('');
      fetchRecursos();
    } catch (err) {
      console.error('Erro ao adicionar recurso:', err);
    }
  };

  const deletarRecurso = async (id: string) => {
    if (!confirm('Deseja realmente remover este link?')) return;
    try {
      const { error } = await supabase
        .from('recursos_desplugados')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRecursos();
    } catch (err) {
      console.error('Erro ao deletar recurso:', err);
    }
  };

  const fetchAtividades = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('atividades_desplugadas')
        .select(`
          *,
          turmas (nome, alunos_turmas(count)),
          inscricoes_atividades (count)
        `)
        .eq('professor_id', user?.id)
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      setAtividades(data || []);
    } catch (err) {
      console.error('Erro ao buscar atividades:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTurmas = async () => {
    try {
      const { data, error } = await supabase
        .from('turmas')
        .select('*')
        .eq('professor_id', user?.id);
      
      if (error) throw error;
      setTurmas(data || []);
    } catch (err) {
      console.error('Erro ao buscar turmas:', err);
    }
  };

  const atividadesAtivas = atividades.filter(a => !a.concluida);
  const atividadesConcluidas = atividades.filter(a => a.concluida);

  const criarAtividade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let anexo_url = null;

      if (arquivoAnexo) {
        // Preservar o nome original tirando caracteres estranhos e adicionando timestamp
        const safeName = arquivoAnexo.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}-${safeName}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('atividades_anexos')
          .upload(filePath, arquivoAnexo);

        if (uploadError) {
          alert('Erro ao fazer upload do anexo. Verifique se o bucket "atividades_anexos" está criado e configurado como público.');
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('atividades_anexos')
          .getPublicUrl(filePath);
          
        anexo_url = publicUrl;
      }

      const { error } = await supabase
        .from('atividades_desplugadas')
        .insert([{
          titulo: tituloAtividade,
          descricao: descricaoAtividade,
          turma_id: turmaSelecionada,
          professor_id: user?.id,
          materiais: materiaisAtividade,
          data_agendada: dataAgendadaAtividade || null,
          anexo_url: anexo_url
        }]);

      if (error) throw error;
      
      setMostrarModal(false);
      setTituloAtividade('');
      setDescricaoAtividade('');
      setTurmaSelecionada('');
      setMateriaisAtividade('');
      setDataAgendadaAtividade('');
      setArquivoAnexo(null);
      fetchAtividades();
    } catch (err) {
      console.error('Erro ao criar atividade:', err);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoConcluida = async (atividadeId: string) => {
    try {
      const { error } = await supabase
        .from('atividades_desplugadas')
        .update({ 
          concluida: true, 
          data_conclusao: new Date().toISOString(),
          feedback: 'Atividade concluída com sucesso!'
        })
        .eq('id', atividadeId);

      if (error) throw error;
      fetchAtividades();
    } catch (err) {
      console.error('Erro ao concluir atividade:', err);
    }
  };

  const deletarAtividade = async (atividadeId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta atividade?')) return;
    
    try {
      // 1. Procurar a atividade na lista local para ver se tem anexo
      const atividade = atividades.find(a => a.id === atividadeId);
      
      if (atividade?.anexo_url) {
        // Extrair o caminho do arquivo do URL (tudo depois do nome do bucket)
        const urlParts = atividade.anexo_url.split('atividades_anexos/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          
          // Deletar o arquivo físico do Supabase Storage
          const { error: storageError } = await supabase.storage
            .from('atividades_anexos')
            .remove([filePath]);
            
          if (storageError) {
            console.error('Erro ao deletar anexo do storage:', storageError);
          }
        }
      }

      // 2. Deletar o registro do banco de dados
      const { error } = await supabase
        .from('atividades_desplugadas')
        .delete()
        .eq('id', atividadeId);

      if (error) throw error;
      fetchAtividades();
    } catch (err) {
      console.error('Erro ao deletar atividade:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Link to="/dashboard-professor" className="text-gray-600 hover:text-gray-900 flex-shrink-0">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-blue-700 font-bold truncate text-sm sm:text-base md:text-xl">Atividades Desplugadas</h1>
                <p className="text-gray-600 text-xs sm:text-sm truncate hidden sm:block">Gerenciar atividades offline e práticas</p>
              </div>
            </div>
            <button
              onClick={() => setMostrarModal(true)}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0 text-sm"
              title="Nova Atividade"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Nova Atividade</span>
              <span className="inline sm:hidden">Nova</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6 main-content">
            {/* Tabs */}
            <div className="flex gap-2 bg-white rounded-xl shadow-lg p-2">
              <button
                onClick={() => setAbaSelecionada('ativas')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  abaSelecionada === 'ativas'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Ativas ({atividadesAtivas.length})
              </button>
              <button
                onClick={() => setAbaSelecionada('concluidas')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  abaSelecionada === 'concluidas'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Concluídas ({atividadesConcluidas.length})
              </button>
            </div>

            {/* Atividades Ativas */}
            {abaSelecionada === 'ativas' && (
              <div className="space-y-4">
                {atividadesAtivas.map((atividade) => (
                  <div key={atividade.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-gray-800">{atividade.titulo}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Ativa
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{atividade.descricao}</p>
                        
                        <div className="flex items-center gap-4 text-gray-600 mb-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {atividade.turmas?.nome}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Criada em {new Date(atividade.data_criacao).toLocaleDateString()}
                          </span>
                          {atividade.data_agendada && (
                             <span className="flex items-center gap-1 text-purple-600 font-medium">
                               <CalendarIcon className="w-4 h-4" />
                               Agendada para: {new Date(atividade.data_agendada).toLocaleDateString()}
                             </span>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-gray-700 mb-1">📦 Materiais necessários:</p>
                          <p className="text-gray-600">{atividade.materiais || 'Nenhum material especificado.'}</p>
                        </div>

                        {atividade.anexo_url && (
                          <div className="mb-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                             <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                               <FileText className="w-4 h-4 text-blue-600" />
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
                              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                            >
                              <Paperclip className="w-4 h-4" />
                              Baixar Anexo
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => deletarAtividade(atividade.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Excluir atividade ${atividade.titulo}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progresso baseado nas inscrições reais */}
                    <div className="mb-4">
                      <div className="flex justify-between text-gray-700 mb-2">
                        <span>Status das Inscrições</span>
                        <span>
                          {atividade.inscricoes_atividades?.[0]?.count || 0} de {atividade.turmas?.alunos_turmas?.[0]?.count || 0} alunos
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(100, ((atividade.inscricoes_atividades?.[0]?.count || 0) / Math.max(1, atividade.turmas?.alunos_turmas?.[0]?.count || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => marcarComoConcluida(atividade.id)}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        aria-label={`Registrar conclusão da atividade ${atividade.titulo}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Registrar Conclusão
                      </button>
                    </div>
                  </div>
                ))}
                {atividadesAtivas.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <p className="text-gray-500">Nenhuma atividade ativa no momento.</p>
                  </div>
                )}
              </div>
            )}

            {/* Atividades Concluídas */}
            {abaSelecionada === 'concluidas' && (
              <div className="space-y-4">
                {atividadesConcluidas.map((atividade) => (
                  <div key={atividade.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <h3 className="text-gray-800">{atividade.titulo}</h3>
                        </div>
                        <p className="text-gray-600 mb-3">{atividade.descricao}</p>
                        
                        <div className="flex items-center gap-4 text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {atividade.turmas?.nome}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Concluída em {new Date(atividade.data_conclusao).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                          <p className="text-green-800 mb-1">💬 Feedback do Professor:</p>
                          <p className="text-green-700">{atividade.feedback}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-gray-600">{atividade.inscricoes_atividades?.[0]?.count || 0} alunos participaram</span>
                      <button 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => deletarAtividade(atividade.id)}
                        aria-label={`Excluir atividade concluída ${atividade.titulo}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {atividadesConcluidas.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <p className="text-gray-500">Nenhuma atividade concluída ainda.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sidebar-container">
            {/* Sobre Atividades Desplugadas */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="mb-4">💡 Sobre Atividades Desplugadas</h3>
              <p className="text-green-100 mb-4">
                Atividades desplugadas ensinam conceitos de programação sem computador, 
                usando materiais físicos e dinâmicas em grupo.
              </p>
              <ul className="space-y-2 text-green-100">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Desenvolve pensamento computacional</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Promove colaboração</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Acessível a todos os alunos</span>
                </li>
              </ul>
            </div>

            {/* Ideias de Atividades */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">💭 Ideias de Atividades</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <h4 className="text-gray-800 mb-1">Classificação de Objetos</h4>
                  <p className="text-gray-600">Ensina conceitos de variáveis e tipos de dados</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <h4 className="text-gray-800 mb-1">Jogo do Telefone Bugado</h4>
                  <p className="text-gray-600">Demonstra a importância de debugging</p>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <h4 className="text-gray-800 mb-1">Labirinto com Comandos</h4>
                  <p className="text-gray-600">Prática de sequências e loops</p>
                </div>
              </div>
            </div>

            {/* Recursos Dinâmicos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">📚 Recursos Úteis</h3>

              <div className="space-y-3 mb-6">
                {recursosLinks.map((recurso) => (
                  <div key={recurso.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                    <a href={recurso.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 truncate pr-4">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{recurso.titulo}</span>
                    </a>
                    <button 
                      onClick={() => deletarRecurso(recurso.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label={`Excluir recurso ${recurso.titulo}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {recursosLinks.length === 0 && (
                  <p className="text-sm text-gray-500 italic">Nenhum recurso cadastrado ainda.</p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-2">
                <p className="text-sm font-bold text-gray-700 mb-2">Adicionar Novo Recurso</p>
                <form onSubmit={adicionarRecurso} className="space-y-2">
                  <input
                    type="text"
                    value={novoRecursoTitulo}
                    onChange={(e) => setNovoRecursoTitulo(e.target.value)}
                    placeholder="Título (ex: Guia PDF)"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-200 outline-none"
                    required
                  />
                  <input
                    type="url"
                    value={novoRecursoUrl}
                    onChange={(e) => setNovoRecursoUrl(e.target.value)}
                    placeholder="URL (https://...)"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-200 outline-none"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full mt-2 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Link
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Nova Atividade */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-gray-800 mb-6">Criar Nova Atividade Desplugada</h2>
            
            <form onSubmit={criarAtividade} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Título da Atividade</label>
                <input
                  type="text"
                  value={tituloAtividade}
                  onChange={(e) => setTituloAtividade(e.target.value)}
                  placeholder="Ex: Algoritmo do Sanduíche"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={descricaoAtividade}
                  onChange={(e) => setDescricaoAtividade(e.target.value)}
                  placeholder="Descreva a atividade e seus objetivos pedagógicos..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Turma</label>
                <select
                  value={turmaSelecionada}
                  onChange={(e) => setTurmaSelecionada(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                >
                  <option value="">Selecione uma turma</option>
                  {turmas.map(turma => (
                    <option key={turma.id} value={turma.id}>{turma.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Materiais Necessários</label>
                <input
                  type="text"
                  value={materiaisAtividade}
                  onChange={(e) => setMateriaisAtividade(e.target.value)}
                  placeholder="Ex: Papel, caneta, cartões..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Data Agendada</label>
                  <input
                    type="date"
                    value={dataAgendadaAtividade}
                    onChange={(e) => setDataAgendadaAtividade(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Anexo (Opcional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => setArquivoAnexo(e.target.files ? e.target.files[0] : null)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all text-gray-600"
                    >
                      <Paperclip className="w-5 h-5" />
                      {arquivoAnexo ? arquivoAnexo.name : 'Selecionar Arquivo'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 mb-2">💡 Dica</p>
                <p className="text-blue-700">
                  Certifique-se de ter todos os materiais necessários antes de iniciar a atividade com a turma.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModal(false);
                    setTituloAtividade('');
                    setDescricaoAtividade('');
                    setTurmaSelecionada('');
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Criar Atividade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
