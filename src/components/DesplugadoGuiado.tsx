import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, Clock, Users, FileText, Edit, Trash2 } from 'lucide-react';

export function DesplugadoGuiado() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tituloAtividade, setTituloAtividade] = useState('');
  const [descricaoAtividade, setDescricaoAtividade] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [abaSelecionada, setAbaSelecionada] = useState<'ativas' | 'concluidas'>('ativas');

  const turmas = [
    { id: 1, nome: '7º Ano A' },
    { id: 2, nome: '7º Ano B' },
    { id: 3, nome: '8º Ano A' }
  ];

  const atividadesAtivas = [
    {
      id: 1,
      titulo: 'Algoritmo do Sanduíche',
      descricao: 'Os alunos devem escrever instruções passo a passo para fazer um sanduíche, praticando sequências de comandos.',
      turma: '7º Ano A',
      dataCriacao: '20/11/2024',
      participantes: 28,
      concluidos: 18,
      materiais: 'Papel, caneta, ingredientes para sanduíche (opcional)'
    },
    {
      id: 2,
      titulo: 'Loops com Coreografia',
      descricao: 'Criar uma sequência de movimentos de dança que se repete, ilustrando o conceito de loops.',
      turma: '7º Ano B',
      dataCriacao: '22/11/2024',
      participantes: 25,
      concluidos: 12,
      materiais: 'Espaço livre, música'
    },
    {
      id: 3,
      titulo: 'Árvore de Decisões',
      descricao: 'Construir um fluxograma físico usando papel e fitas, mostrando condicionais (if/else).',
      turma: '8º Ano A',
      dataCriacao: '18/11/2024',
      participantes: 30,
      concluidos: 25,
      materiais: 'Papel colorido, fita adesiva, canetinhas'
    }
  ];

  const atividadesConcluidas = [
    {
      id: 4,
      titulo: 'Robô Humano',
      descricao: 'Um aluno é o "robô" e segue comandos dos colegas para completar uma tarefa.',
      turma: '7º Ano A',
      dataConclusao: '15/11/2024',
      participantes: 28,
      feedback: 'Atividade muito engajadora! Os alunos adoraram.'
    },
    {
      id: 5,
      titulo: 'Ordenação com Cartas',
      descricao: 'Demonstração de algoritmos de ordenação usando cartas de baralho.',
      turma: '7º Ano B',
      dataConclusao: '10/11/2024',
      participantes: 25,
      feedback: 'Ótimo para visualizar diferentes estratégias de ordenação.'
    }
  ];

  const criarAtividade = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de criar atividade
    setMostrarModal(false);
    setTituloAtividade('');
    setDescricaoAtividade('');
    setTurmaSelecionada('');
  };

  const marcarComoConcluida = (atividadeId: number, alunoId?: number) => {
    // Lógica para marcar atividade como concluída
    console.log('Marcar como concluída:', atividadeId, alunoId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard-professor" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-blue-700">Atividades Desplugadas</h1>
              <p className="text-gray-600">Gerenciar atividades offline e práticas</p>
            </div>
            <button
              onClick={() => setMostrarModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nova Atividade
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
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
                        
                        <div className="flex items-center gap-4 text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {atividade.turma}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {atividade.dataCriacao}
                          </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-gray-700 mb-1">📦 Materiais necessários:</p>
                          <p className="text-gray-600">{atividade.materiais}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progresso */}
                    <div className="mb-4">
                      <div className="flex justify-between text-gray-700 mb-2">
                        <span>Progresso da Turma</span>
                        <span>{atividade.concluidos}/{atividade.participantes} alunos</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all"
                          style={{ width: `${(atividade.concluidos / atividade.participantes) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => marcarComoConcluida(atividade.id)}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Registrar Conclusão
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
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
                            {atividade.turma}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Concluída em {atividade.dataConclusao}
                          </span>
                        </div>

                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                          <p className="text-green-800 mb-1">💬 Feedback do Professor:</p>
                          <p className="text-green-700">{atividade.feedback}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-gray-600">{atividade.participantes} alunos participaram</span>
                      <button className="text-blue-600 hover:text-blue-700">
                        Ver Relatório
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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

              <button className="w-full mt-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Ver Biblioteca Completa
              </button>
            </div>

            {/* Recursos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">📚 Recursos</h3>
              
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <FileText className="w-4 h-4" />
                  <span>Guia de Atividades Desplugadas</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <FileText className="w-4 h-4" />
                  <span>Templates para Imprimir</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <FileText className="w-4 h-4" />
                  <span>Vídeos Demonstrativos</span>
                </a>
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

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
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
