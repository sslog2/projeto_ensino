import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, AlertTriangle, TrendingUp, BookOpen, Code2, LogOut, Plus, Target } from 'lucide-react';

export function DashboardProfessor() {
  const { user, logout } = useAuth();

  const turmas = [
    { id: 1, nome: '7º Ano A', alunos: 28, metaSemanal: 85, alertas: 2 },
    { id: 2, nome: '7º Ano B', alunos: 25, metaSemanal: 72, alertas: 4 },
    { id: 3, nome: '8º Ano A', alunos: 30, metaSemanal: 91, alertas: 1 },
  ];

  const alunosComDificuldade = [
    { id: 1, nome: 'Ana Costa', turma: '7º Ano A', conceito: 'Loops', tentativas: 8 },
    { id: 2, nome: 'Pedro Santos', turma: '7º Ano B', conceito: 'Condicionais', tentativas: 6 },
    { id: 3, nome: 'Maria Oliveira', turma: '7º Ano B', conceito: 'Variáveis', tentativas: 5 },
  ];

  const estatisticas = {
    totalAlunos: 83,
    mediaEngajamento: 78,
    desafiosConcluidos: 312,
    horasEstudo: 124
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Code2 className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-gray-600">Dashboard do Professor</p>
              <h1 className="text-blue-700">{user?.nome}</h1>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-gray-600 mb-1">Total de Alunos</p>
            <p className="text-gray-900">{estatisticas.totalAlunos}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-gray-600 mb-1">Engajamento Médio</p>
            <p className="text-gray-900">{estatisticas.mediaEngajamento}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Target className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-gray-600 mb-1">Desafios Concluídos</p>
            <p className="text-gray-900">{estatisticas.desafiosConcluidos}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <BookOpen className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-gray-600 mb-1">Horas de Estudo</p>
            <p className="text-gray-900">{estatisticas.horasEstudo}h</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Turmas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-800">Minhas Turmas</h2>
                <Link
                  to="/turmas"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-gray-800">{turma.nome}</h3>
                        <p className="text-gray-600">{turma.alunos} alunos</p>
                      </div>
                      {turma.alertas > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{turma.alertas}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
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
                  </Link>
                ))}
              </div>
            </div>

            {/* Atalhos */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/turmas"
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-400"
              >
                <Users className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="text-gray-800 mb-1">Gerenciar Turmas</h3>
                <p className="text-gray-600">Criar e editar turmas</p>
              </Link>

              <Link
                to="/desplugado"
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-green-400"
              >
                <BookOpen className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="text-gray-800 mb-1">Atividades Desplugadas</h3>
                <p className="text-gray-600">Gerenciar atividades offline</p>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alertas de Alunos com Dificuldade */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h3 className="text-gray-800">Alunos com Dificuldade</h3>
              </div>
              
              <div className="space-y-3">
                {alunosComDificuldade.map(aluno => (
                  <Link
                    key={aluno.id}
                    to={`/aluno/${aluno.id}`}
                    className="block p-3 rounded-lg bg-orange-50 border-2 border-orange-200 hover:border-orange-400 transition-all"
                  >
                    <p className="text-gray-800">{aluno.nome}</p>
                    <p className="text-gray-600">{aluno.turma}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-orange-700">Dificuldade: {aluno.conceito}</span>
                      <span className="text-gray-600">{aluno.tentativas} tentativas</span>
                    </div>
                  </Link>
                ))}
              </div>

              {alunosComDificuldade.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum aluno com dificuldades no momento! 🎉</p>
                </div>
              )}
            </div>

            {/* Dicas Pedagógicas */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="mb-3">💡 Dica Pedagógica</h3>
              <p className="text-blue-100">
                Incentive a colaboração entre os alunos através das missões colaborativas. 
                Estudos mostram que o aprendizado em grupo melhora a retenção em até 40%!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
