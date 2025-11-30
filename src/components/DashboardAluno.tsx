import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Star, Target, Users, Code2, LogOut, User, Map, Zap } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';

export function DashboardAluno() {
  const { user, logout } = useAuth();

  const desafiosRecomendados = [
    { id: 1, titulo: 'Laços de Repetição', dificuldade: 'Médio', pontos: 150, progresso: 60 },
    { id: 2, titulo: 'Condicionais Avançadas', dificuldade: 'Difícil', pontos: 200, progresso: 0 },
    { id: 3, titulo: 'Variáveis e Operadores', dificuldade: 'Fácil', pontos: 100, progresso: 100 },
  ];

  const conquistas = [
    { id: 1, titulo: 'Primeira Vitória', icone: '🏆', desbloqueado: true },
    { id: 2, titulo: 'Mestre dos Loops', icone: '🔄', desbloqueado: true },
    { id: 3, titulo: 'Colaborador', icone: '🤝', desbloqueado: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Code2 className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-gray-600">Olá,</p>
              <h1 className="text-purple-700">{user?.nome}</h1>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
                <Trophy className="w-8 h-8 mb-2" />
                <p className="text-yellow-100">Nível</p>
                <p className="text-white">{user?.nivel || 1}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
                <Star className="w-8 h-8 mb-2" />
                <p className="text-purple-100">Pontos</p>
                <p className="text-white">{user?.pontos || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
                <Zap className="w-8 h-8 mb-2" />
                <p className="text-blue-100">Sequência</p>
                <p className="text-white">7 dias</p>
              </div>
            </div>

            {/* Desafios Recomendados */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-800">Desafios Recomendados</h2>
                <Link to="/mapa-desafios" className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
                  Ver todos
                  <Map className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {desafiosRecomendados.map(desafio => (
                  <Link
                    key={desafio.id}
                    to={`/desafio/${desafio.id}`}
                    className="block p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-gray-800">{desafio.titulo}</h3>
                        <p className="text-gray-600">Dificuldade: {desafio.dificuldade}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-5 h-5 fill-current" />
                          <span>{desafio.pontos}</span>
                        </div>
                      </div>
                    </div>
                    
                    {desafio.progresso > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${desafio.progresso}%` }}
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Atalhos Rápidos */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/ranking"
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-400"
              >
                <Users className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="text-gray-800 mb-1">Ranking da Turma</h3>
                <p className="text-gray-600">Você está em 3º lugar!</p>
              </Link>

              <Link
                to="/missoes"
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-400"
              >
                <Target className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="text-gray-800 mb-1">Missões Colaborativas</h3>
                <p className="text-gray-600">2 missões ativas</p>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar e Perfil */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <AvatarEvolutivo
                  nivel={user?.nivel || 1}
                  tipo={user?.avatar?.corpo || 'basic'}
                />
                <Link to="/perfil" className="mt-4 flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700">
                  <User className="w-4 h-4" />
                  Personalizar Avatar
                </Link>
              </div>
            </div>

            {/* Conquistas Recentes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Conquistas</h3>
              <div className="space-y-3">
                {conquistas.map(conquista => (
                  <div
                    key={conquista.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      conquista.desbloqueado
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className="text-2xl">{conquista.icone}</div>
                    <div className="flex-1">
                      <p className="text-gray-800">{conquista.titulo}</p>
                    </div>
                    {conquista.desbloqueado && (
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Progresso Semanal */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Meta Semanal da Turma</h3>
              <div className="mb-2">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>850 / 1000 pontos</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <p className="text-gray-600 mt-3">Faltam apenas 150 pontos para desbloquear a recompensa coletiva! 🎉</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
