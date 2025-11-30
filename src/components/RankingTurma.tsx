import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Trophy, Star, TrendingUp, Medal, Target } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';

export function RankingTurma() {
  const { user } = useAuth();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'semanal' | 'mensal' | 'geral'>('semanal');

  const ranking = [
    { id: 1, nome: 'Carlos Souza', nivel: 8, pontos: 2450, posicao: 1, pontosSemanais: 580, avatar: 'mage' },
    { id: 2, nome: 'Ana Lima', nivel: 7, pontos: 2180, posicao: 2, pontosSemanais: 520, avatar: 'warrior' },
    { id: 3, nome: 'João Silva', nivel: 5, pontos: 1250, posicao: 3, pontosSemanais: 380, avatar: 'warrior', euSou: true },
    { id: 4, nome: 'Maria Santos', nivel: 6, pontos: 1180, posicao: 4, pontosSemanais: 340, avatar: 'basic' },
    { id: 5, nome: 'Pedro Costa', nivel: 5, pontos: 980, posicao: 5, pontosSemanais: 290, avatar: 'basic' },
    { id: 6, nome: 'Juliana Alves', nivel: 4, pontos: 820, posicao: 6, pontosSemanais: 250, avatar: 'basic' },
    { id: 7, nome: 'Lucas Ferreira', nivel: 4, pontos: 750, posicao: 7, pontosSemanais: 210, avatar: 'basic' },
    { id: 8, nome: 'Beatriz Silva', nivel: 3, pontos: 620, posicao: 8, pontosSemanais: 180, avatar: 'basic' },
  ];

  const metaTurma = {
    atual: 8500,
    meta: 10000,
    percentual: 85
  };

  const getPosicaoCor = (posicao: number) => {
    if (posicao === 1) return 'from-yellow-400 to-orange-500';
    if (posicao === 2) return 'from-gray-400 to-gray-600';
    if (posicao === 3) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  const getPosicaoIcone = (posicao: number) => {
    if (posicao === 1) return '🥇';
    if (posicao === 2) return '🥈';
    if (posicao === 3) return '🥉';
    return posicao;
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
              <h1 className="text-purple-700">Ranking da Turma</h1>
              <p className="text-gray-600">7º Ano A - Competição amigável</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pódio */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-gray-800 mb-6">Top 3 da Semana</h2>
              
              <div className="flex items-end justify-center gap-4 mb-8">
                {/* 2º Lugar */}
                <div className="flex-1 text-center">
                  <div className="flex justify-center mb-2">
                    <AvatarEvolutivo nivel={ranking[1].nivel} tipo={ranking[1].avatar} tamanho="md" />
                  </div>
                  <div className="bg-gradient-to-br from-gray-400 to-gray-600 text-white rounded-lg p-4 h-32 flex flex-col justify-end">
                    <p className="text-3xl mb-1">🥈</p>
                    <p className="text-white">{ranking[1].nome.split(' ')[0]}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{ranking[1].pontosSemanais}</span>
                    </div>
                  </div>
                </div>

                {/* 1º Lugar */}
                <div className="flex-1 text-center">
                  <div className="flex justify-center mb-2">
                    <AvatarEvolutivo nivel={ranking[0].nivel} tipo={ranking[0].avatar} tamanho="md" />
                  </div>
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-lg p-4 h-40 flex flex-col justify-end shadow-lg">
                    <p className="text-4xl mb-1">🥇</p>
                    <p className="text-white">{ranking[0].nome.split(' ')[0]}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{ranking[0].pontosSemanais}</span>
                    </div>
                  </div>
                </div>

                {/* 3º Lugar */}
                <div className="flex-1 text-center">
                  <div className="flex justify-center mb-2">
                    <AvatarEvolutivo nivel={ranking[2].nivel} tipo={ranking[2].avatar} tamanho="md" />
                  </div>
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-lg p-4 h-28 flex flex-col justify-end">
                    <p className="text-3xl mb-1">🥉</p>
                    <p className="text-white">{ranking[2].nome.split(' ')[0]}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{ranking[2].pontosSemanais}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros de Período */}
            <div className="flex gap-2 bg-white rounded-xl shadow-lg p-2">
              <button
                onClick={() => setPeriodoSelecionado('semanal')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  periodoSelecionado === 'semanal'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setPeriodoSelecionado('mensal')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  periodoSelecionado === 'mensal'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setPeriodoSelecionado('geral')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  periodoSelecionado === 'geral'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Geral
              </button>
            </div>

            {/* Lista Completa do Ranking */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-gray-800 mb-4">Ranking Completo</h2>
              
              <div className="space-y-3">
                {ranking.map((aluno) => (
                  <div
                    key={aluno.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      aluno.euSou
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-400'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {/* Posição */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getPosicaoCor(aluno.posicao)} flex items-center justify-center text-white flex-shrink-0`}>
                      <span className="text-xl">{getPosicaoIcone(aluno.posicao)}</span>
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <AvatarEvolutivo nivel={aluno.nivel} tipo={aluno.avatar} tamanho="sm" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800">{aluno.nome}</p>
                        {aluno.euSou && (
                          <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">Você</span>
                        )}
                      </div>
                      <p className="text-gray-600">Nível {aluno.nivel}</p>
                    </div>

                    {/* Pontos */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-600 mb-1">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="text-gray-900">{aluno.pontosSemanais}</span>
                      </div>
                      <p className="text-gray-600">{aluno.pontos} total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meta da Turma */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <h3 className="text-gray-800">Meta Semanal da Turma</h3>
              </div>

              <div className="text-center mb-4">
                <p className="text-gray-900 mb-2">{metaTurma.atual.toLocaleString()} / {metaTurma.meta.toLocaleString()} pontos</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all"
                    style={{ width: `${metaTurma.percentual}%` }}
                  />
                </div>
                <p className="text-gray-600 mt-2">{metaTurma.percentual}% completo</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  🎉 Faltam apenas 1.500 pontos para desbloquear a recompensa coletiva:
                  <span className="block mt-2">🏆 Novo tema "Espaço Sideral"</span>
                </p>
              </div>
            </div>

            {/* Sua Posição */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="mb-4">📊 Sua Posição</h3>
              
              <div className="bg-white/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Posição Atual</span>
                  <span className="text-2xl">3º</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Pontos esta semana</span>
                  <span>380 pts</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/90">
                  <TrendingUp className="w-4 h-4" />
                  <span>+2 posições esta semana</span>
                </div>
                <p className="text-white/80">
                  Você precisa de 140 pontos para alcançar o 2º lugar!
                </p>
              </div>
            </div>

            {/* Dicas de Competição */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-3">💡 Dicas</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 flex-shrink-0">•</span>
                  <span>Complete desafios mais difíceis para ganhar mais pontos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 flex-shrink-0">•</span>
                  <span>Participe de missões colaborativas para pontuar em equipe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 flex-shrink-0">•</span>
                  <span>Mantenha sua sequência de estudos ativa</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
