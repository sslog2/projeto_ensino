import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Star, Lock, CheckCircle, Trophy } from 'lucide-react';

export function MapaDesafios() {
  const { user } = useAuth();

  const trilhas = [
    {
      id: 1,
      nome: 'Fundamentos',
      modulos: [
        { id: 1, nome: 'Sequências', dificuldade: 'Fácil', concluido: true, pontos: 100, bloqueado: false },
        { id: 2, nome: 'Variáveis', dificuldade: 'Fácil', concluido: true, pontos: 100, bloqueado: false },
        { id: 3, nome: 'Operadores', dificuldade: 'Médio', concluido: false, pontos: 150, bloqueado: false },
        { id: 4, nome: 'Entrada/Saída', dificuldade: 'Médio', concluido: false, pontos: 150, bloqueado: false },
      ]
    },
    {
      id: 2,
      nome: 'Estruturas de Controle',
      modulos: [
        { id: 5, nome: 'Condicionais If', dificuldade: 'Médio', concluido: true, pontos: 150, bloqueado: false },
        { id: 6, nome: 'Condicionais Aninhadas', dificuldade: 'Médio', concluido: false, pontos: 150, bloqueado: false },
        { id: 7, nome: 'Switch/Case', dificuldade: 'Difícil', concluido: false, pontos: 200, bloqueado: false },
      ]
    },
    {
      id: 3,
      nome: 'Laços de Repetição',
      modulos: [
        { id: 8, nome: 'Loop While', dificuldade: 'Médio', concluido: false, pontos: 150, bloqueado: false },
        { id: 9, nome: 'Loop For', dificuldade: 'Difícil', concluido: false, pontos: 200, bloqueado: false },
        { id: 10, nome: 'Loops Aninhados', dificuldade: 'Difícil', concluido: false, pontos: 250, bloqueado: true },
      ]
    },
    {
      id: 4,
      nome: 'Estruturas de Dados',
      modulos: [
        { id: 11, nome: 'Listas/Arrays', dificuldade: 'Difícil', concluido: false, pontos: 200, bloqueado: true },
        { id: 12, nome: 'Dicionários', dificuldade: 'Difícil', concluido: false, pontos: 250, bloqueado: true },
        { id: 13, nome: 'Manipulação de Dados', dificuldade: 'Muito Difícil', concluido: false, pontos: 300, bloqueado: true },
      ]
    }
  ];

  const getDificuldadeCor = (dificuldade: string) => {
    switch(dificuldade) {
      case 'Fácil': return 'text-green-600 bg-green-100';
      case 'Médio': return 'text-yellow-600 bg-yellow-100';
      case 'Difícil': return 'text-orange-600 bg-orange-100';
      case 'Muito Difícil': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard-aluno" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-purple-700">Mapa de Desafios</h1>
              <p className="text-gray-600">Escolha sua próxima aventura</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progresso Geral */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-800">Seu Progresso Geral</h2>
              <p className="text-gray-600">Continue sua jornada de aprendizado!</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Nível {user?.nivel || 1}</p>
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="w-5 h-5 fill-current" />
                <span>{user?.pontos || 0} pontos</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full" style={{ width: '35%' }} />
          </div>
          <p className="text-gray-600 mt-2">5 de 13 desafios concluídos</p>
        </div>

        {/* Trilhas de Aprendizado */}
        <div className="space-y-8">
          {trilhas.map((trilha, trilhaIndex) => (
            <div key={trilha.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  trilhaIndex === 0 ? 'bg-green-100' :
                  trilhaIndex === 1 ? 'bg-blue-100' :
                  trilhaIndex === 2 ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <Trophy className={`w-6 h-6 ${
                    trilhaIndex === 0 ? 'text-green-600' :
                    trilhaIndex === 1 ? 'text-blue-600' :
                    trilhaIndex === 2 ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
                <div>
                  <h2 className="text-gray-800">{trilha.nome}</h2>
                  <p className="text-gray-600">{trilha.modulos.length} desafios</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {trilha.modulos.map((modulo) => (
                  <div key={modulo.id} className="relative">
                    {modulo.bloqueado ? (
                      <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 opacity-60">
                        <div className="flex items-center justify-between mb-2">
                          <Lock className="w-6 h-6 text-gray-400" />
                          <span className={`px-2 py-1 rounded-full text-xs ${getDificuldadeCor(modulo.dificuldade)}`}>
                            {modulo.dificuldade}
                          </span>
                        </div>
                        <h3 className="text-gray-500 mb-1">{modulo.nome}</h3>
                        <p className="text-gray-400">Bloqueado</p>
                      </div>
                    ) : (
                      <Link
                        to={`/desafio/${modulo.id}`}
                        className={`block p-4 rounded-lg border-2 transition-all ${
                          modulo.concluido
                            ? 'border-green-400 bg-green-50 hover:shadow-md'
                            : 'border-purple-300 bg-white hover:border-purple-500 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          {modulo.concluido ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-purple-400" />
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs ${getDificuldadeCor(modulo.dificuldade)}`}>
                            {modulo.dificuldade}
                          </span>
                        </div>
                        <h3 className="text-gray-800 mb-1">{modulo.nome}</h3>
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{modulo.pontos} pts</span>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
