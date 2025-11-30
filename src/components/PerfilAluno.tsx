import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Trophy, Star, Target, TrendingUp } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';

export function PerfilAluno() {
  const { user, atualizarUsuario } = useAuth();
  const [avatarSelecionado, setAvatarSelecionado] = useState(user?.avatar?.corpo || 'basic');

  const opcoesAvatar = [
    { id: 'basic', nome: 'Básico', nivel: 1, desbloqueado: true },
    { id: 'warrior', nome: 'Guerreiro', nivel: 5, desbloqueado: (user?.nivel || 0) >= 5 },
    { id: 'mage', nome: 'Mago', nivel: 10, desbloqueado: (user?.nivel || 0) >= 10 },
    { id: 'dragon', nome: 'Dragão', nivel: 15, desbloqueado: (user?.nivel || 0) >= 15 },
  ];

  const conquistas = [
    { id: 1, titulo: 'Primeira Vitória', descricao: 'Complete seu primeiro desafio', icone: '🏆', desbloqueado: true, data: '15/11/2024' },
    { id: 2, titulo: 'Mestre dos Loops', descricao: 'Complete 5 desafios com loops', icone: '🔄', desbloqueado: true, data: '18/11/2024' },
    { id: 3, titulo: 'Colaborador', descricao: 'Complete uma missão colaborativa', icone: '🤝', desbloqueado: false, data: null },
    { id: 4, titulo: 'Sequência de 7 Dias', descricao: 'Estude por 7 dias consecutivos', icone: '🔥', desbloqueado: true, data: '20/11/2024' },
    { id: 5, titulo: 'Perfeccionista', descricao: 'Complete um desafio com 3 estrelas', icone: '⭐', desbloqueado: true, data: '16/11/2024' },
    { id: 6, titulo: 'Top 3', descricao: 'Fique entre os 3 primeiros do ranking', icone: '🥉', desbloqueado: true, data: '19/11/2024' },
  ];

  const estatisticas = {
    desafiosConcluidos: 12,
    totalDesafios: 25,
    horasEstudo: 8.5,
    tentativasMedia: 2.3,
    sequenciaDias: 7,
    rankingPosicao: 3,
    totalAlunos: 28
  };

  const salvarAvatar = () => {
    if (user) {
      atualizarUsuario({
        avatar: {
          ...user.avatar,
          corpo: avatarSelecionado
        } as any
      });
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
              <h1 className="text-purple-700">Meu Perfil</h1>
              <p className="text-gray-600">Visualize e personalize seu perfil</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personalização do Avatar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-gray-800 mb-6">Personalize seu Avatar</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {opcoesAvatar.map((opcao) => (
                  <button
                    key={opcao.id}
                    onClick={() => opcao.desbloqueado && setAvatarSelecionado(opcao.id)}
                    disabled={!opcao.desbloqueado}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      avatarSelecionado === opcao.id
                        ? 'border-purple-600 bg-purple-50'
                        : opcao.desbloqueado
                        ? 'border-gray-200 hover:border-purple-300'
                        : 'border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <AvatarEvolutivo nivel={opcao.nivel} tipo={opcao.id} tamanho="sm" />
                    </div>
                    <p className="text-gray-800 text-center">{opcao.nome}</p>
                    {!opcao.desbloqueado && (
                      <p className="text-gray-600 text-center mt-1">Nível {opcao.nivel}</p>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={salvarAvatar}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Salvar Avatar
              </button>
            </div>

            {/* Conquistas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-gray-800 mb-6">Conquistas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conquistas.map((conquista) => (
                  <div
                    key={conquista.id}
                    className={`p-4 rounded-lg border-2 ${
                      conquista.desbloqueado
                        ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{conquista.icone}</div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 mb-1">{conquista.titulo}</h3>
                        <p className="text-gray-600">{conquista.descricao}</p>
                        {conquista.desbloqueado && conquista.data && (
                          <p className="text-gray-500 mt-2">{conquista.data}</p>
                        )}
                      </div>
                      {conquista.desbloqueado && (
                        <Trophy className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card do Perfil */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <AvatarEvolutivo nivel={user?.nivel || 1} tipo={avatarSelecionado} />
              <h2 className="text-gray-800 mt-4">{user?.nome}</h2>
              <p className="text-gray-600">Nível {user?.nivel || 1}</p>
              
              <div className="flex items-center justify-center gap-2 mt-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-gray-700">{user?.pontos || 0} pontos</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-2">Progresso do Nível</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-gray-600">75% para o próximo nível</p>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Estatísticas</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Desafios</span>
                  </div>
                  <span className="text-gray-900">{estatisticas.desafiosConcluidos}/{estatisticas.totalDesafios}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Horas de Estudo</span>
                  </div>
                  <span className="text-gray-900">{estatisticas.horasEstudo}h</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <span className="text-gray-700">Sequência</span>
                  </div>
                  <span className="text-gray-900">{estatisticas.sequenciaDias} dias</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">Ranking</span>
                  </div>
                  <span className="text-gray-900">{estatisticas.rankingPosicao}º/{estatisticas.totalAlunos}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <span className="text-gray-700">Média de Tentativas</span>
                  </div>
                  <span className="text-gray-900">{estatisticas.tentativasMedia}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
