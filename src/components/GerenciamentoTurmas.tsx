import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Copy, Edit, Trash2, Check } from 'lucide-react';

export function GerenciamentoTurmas() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nomeTurma, setNomeTurma] = useState('');
  const [copiado, setCopiado] = useState<string | null>(null);

  const turmas = [
    {
      id: 1,
      nome: '7º Ano A',
      codigo: 'TURMA2024A',
      alunos: 28,
      ativa: true,
      dataCriacao: '01/02/2024',
      metaSemanal: 85
    },
    {
      id: 2,
      nome: '7º Ano B',
      codigo: 'TURMA2024B',
      alunos: 25,
      ativa: true,
      dataCriacao: '01/02/2024',
      metaSemanal: 72
    },
    {
      id: 3,
      nome: '8º Ano A',
      codigo: 'TURMA2024C',
      alunos: 30,
      ativa: true,
      dataCriacao: '01/02/2024',
      metaSemanal: 91
    },
    {
      id: 4,
      nome: '6º Ano C (2023)',
      codigo: 'TURMA2023D',
      alunos: 22,
      ativa: false,
      dataCriacao: '01/02/2023',
      metaSemanal: 0
    }
  ];

  const criarTurma = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de criar turma
    setMostrarModal(false);
    setNomeTurma('');
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
          <div className="flex items-center gap-4">
            <Link to="/dashboard-professor" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-blue-700">Gerenciamento de Turmas</h1>
              <p className="text-gray-600">Crie e gerencie suas turmas</p>
            </div>
            <button
              onClick={() => setMostrarModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nova Turma
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Turmas Ativas */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-4">Turmas Ativas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turmas.filter(t => t.ativa).map((turma) => (
              <div key={turma.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-gray-800 mb-1">{turma.nome}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{turma.alunos} alunos</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Código da Turma */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-gray-600 mb-1">Código de Acesso</p>
                  <div className="flex items-center justify-between">
                    <code className="text-blue-600">{turma.codigo}</code>
                    <button
                      onClick={() => copiarCodigo(turma.codigo)}
                      className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {copiado === turma.codigo ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Meta Semanal */}
                <div className="mb-4">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Meta Semanal</span>
                    <span>{turma.metaSemanal}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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

                <Link
                  to={`/turma/${turma.id}`}
                  className="block w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Turmas Arquivadas */}
        {turmas.filter(t => !t.ativa).length > 0 && (
          <div>
            <h2 className="text-gray-800 mb-4">Turmas Arquivadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {turmas.filter(t => !t.ativa).map((turma) => (
                <div key={turma.id} className="bg-white rounded-xl shadow-lg p-6 opacity-75">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-gray-800 mb-1">{turma.nome}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{turma.alunos} alunos</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                      Arquivada
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">Criada em {turma.dataCriacao}</p>

                  <Link
                    to={`/turma/${turma.id}`}
                    className="block w-full py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-center"
                  >
                    Ver Histórico
                  </Link>
                </div>
              ))}
            </div>
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

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 mb-2">ℹ️ Código de acesso</p>
                <p className="text-blue-700">
                  Um código único será gerado automaticamente para que os alunos possam se inscrever na turma.
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
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
