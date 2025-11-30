import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Users, Clock, Star, CheckCircle, Lock, Plus } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';

export function MissoesColaborativas() {
  const { user } = useAuth();
  const [abaSelecionada, setAbaSelecionada] = useState<'ativas' | 'disponiveis' | 'concluidas'>('ativas');

  const missoesAtivas = [
    {
      id: 1,
      titulo: 'Desafio dos Laços em Dupla',
      descricao: 'Trabalhem juntos para resolver 3 desafios de loops',
      parceiro: { nome: 'Ana Lima', nivel: 7, avatar: 'warrior' },
      progresso: 2,
      total: 3,
      tempoRestante: '2 dias',
      recompensa: 300,
      tipo: 'dupla'
    },
    {
      id: 2,
      titulo: 'Torre de Algoritmos',
      descricao: 'Construam uma solução colaborativa para o desafio final',
      participantes: [
        { nome: 'Carlos', nivel: 8, avatar: 'mage' },
        { nome: 'Maria', nivel: 6, avatar: 'basic' },
        { nome: user?.nome || 'Você', nivel: user?.nivel || 5, avatar: 'warrior' }
      ],
      progresso: 1,
      total: 1,
      tempoRestante: '5 dias',
      recompensa: 500,
      tipo: 'grupo'
    }
  ];

  const missoesDisponiveis = [
    {
      id: 3,
      titulo: 'Caça às Variáveis',
      descricao: 'Encontre e corrija erros em códigos com variáveis',
      vagas: 2,
      dificuldade: 'Médio',
      recompensa: 250,
      tempo: '3 dias',
      tipo: 'dupla'
    },
    {
      id: 4,
      titulo: 'Maratona de Condicionais',
      descricao: 'Resolvam 5 desafios de condicionais em grupo',
      vagas: 4,
      dificuldade: 'Difícil',
      recompensa: 400,
      tempo: '1 semana',
      tipo: 'grupo'
    },
    {
      id: 5,
      titulo: 'Debugging em Equipe',
      descricao: 'Encontrem e corrijam bugs em códigos complexos',
      vagas: 2,
      dificuldade: 'Fácil',
      recompensa: 200,
      tempo: '2 dias',
      tipo: 'dupla'
    }
  ];

  const missoesConcluidas = [
    {
      id: 6,
      titulo: 'Aventura das Sequências',
      parceiro: { nome: 'Pedro Costa', nivel: 5, avatar: 'basic' },
      recompensa: 250,
      dataConclusao: '20/11/2024',
      tipo: 'dupla'
    },
    {
      id: 7,
      titulo: 'Desafio dos Operadores',
      participantes: [
        { nome: 'Lucas', nivel: 4, avatar: 'basic' },
        { nome: 'Juliana', nivel: 4, avatar: 'basic' }
      ],
      recompensa: 350,
      dataConclusao: '15/11/2024',
      tipo: 'grupo'
    }
  ];

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
              <h1 className="text-purple-700">Missões Colaborativas</h1>
              <p className="text-gray-600">Aprenda em equipe e ganhe recompensas extras!</p>
            </div>
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
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Ativas ({missoesAtivas.length})
              </button>
              <button
                onClick={() => setAbaSelecionada('disponiveis')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  abaSelecionada === 'disponiveis'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Disponíveis ({missoesDisponiveis.length})
              </button>
              <button
                onClick={() => setAbaSelecionada('concluidas')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  abaSelecionada === 'concluidas'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Concluídas ({missoesConcluidas.length})
              </button>
            </div>

            {/* Missões Ativas */}
            {abaSelecionada === 'ativas' && (
              <div className="space-y-4">
                {missoesAtivas.map((missao) => (
                  <div key={missao.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-gray-800">{missao.titulo}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            missao.tipo === 'dupla' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {missao.tipo === 'dupla' ? '👥 Dupla' : '👥 Grupo'}
                          </span>
                        </div>
                        <p className="text-gray-600">{missao.descricao}</p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-5 h-5 fill-current" />
                        <span>{missao.recompensa}</span>
                      </div>
                    </div>

                    {/* Participantes */}
                    <div className="mb-4">
                      {missao.tipo === 'dupla' ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <AvatarEvolutivo nivel={user?.nivel || 5} tipo="warrior" tamanho="sm" />
                            <span className="text-gray-700">Você</span>
                          </div>
                          <span className="text-gray-400">+</span>
                          <div className="flex items-center gap-2">
                            <AvatarEvolutivo nivel={missao.parceiro!.nivel} tipo={missao.parceiro!.avatar} tamanho="sm" />
                            <span className="text-gray-700">{missao.parceiro!.nome}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {missao.participantes!.map((p, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <AvatarEvolutivo nivel={p.nivel} tipo={p.avatar} tamanho="sm" />
                              <span className="text-gray-700 text-sm">{p.nome.split(' ')[0]}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Progresso */}
                    <div className="mb-3">
                      <div className="flex justify-between text-gray-600 mb-2">
                        <span>Progresso: {missao.progresso}/{missao.total}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {missao.tempoRestante}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(missao.progresso / missao.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      to={`/desafio/${missao.id}`}
                      className="block w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-center"
                    >
                      Continuar Missão
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Missões Disponíveis */}
            {abaSelecionada === 'disponiveis' && (
              <div className="space-y-4">
                {missoesDisponiveis.map((missao) => (
                  <div key={missao.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-gray-800">{missao.titulo}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            missao.tipo === 'dupla' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {missao.tipo === 'dupla' ? '👥 Dupla' : '👥 Grupo'}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {missao.dificuldade}
                          </span>
                        </div>
                        <p className="text-gray-600">{missao.descricao}</p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-5 h-5 fill-current" />
                        <span>{missao.recompensa}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{missao.vagas} vagas disponíveis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{missao.tempo}</span>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Participar da Missão
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Missões Concluídas */}
            {abaSelecionada === 'concluidas' && (
              <div className="space-y-4">
                {missoesConcluidas.map((missao) => (
                  <div key={missao.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <h3 className="text-gray-800">{missao.titulo}</h3>
                        </div>
                        <p className="text-gray-600">Concluída em {missao.dataConclusao}</p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-5 h-5 fill-current" />
                        <span>+{missao.recompensa}</span>
                      </div>
                    </div>

                    {/* Participantes */}
                    <div className="flex items-center gap-2">
                      {missao.tipo === 'dupla' ? (
                        <>
                          <AvatarEvolutivo nivel={missao.parceiro!.nivel} tipo={missao.parceiro!.avatar} tamanho="sm" />
                          <span className="text-gray-700">{missao.parceiro!.nome}</span>
                        </>
                      ) : (
                        missao.participantes!.map((p, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <AvatarEvolutivo nivel={p.nivel} tipo={p.avatar} tamanho="sm" />
                            <span className="text-gray-700 text-sm">{p.nome}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefícios */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="mb-4">✨ Por que colaborar?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">🎯</span>
                  <span className="text-white/90">Ganhe até 2x mais pontos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">🧠</span>
                  <span className="text-white/90">Aprenda com seus colegas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">🏆</span>
                  <span className="text-white/90">Desbloqueie medalhas exclusivas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">👥</span>
                  <span className="text-white/90">Fortaleça o espírito de equipe</span>
                </li>
              </ul>
            </div>

            {/* Estatísticas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">📊 Suas Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Missões Concluídas</span>
                  <span className="text-gray-900">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Taxa de Sucesso</span>
                  <span className="text-green-600">100%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pontos Colaborativos</span>
                  <span className="text-yellow-600">600</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Parceiros</span>
                  <span className="text-gray-900">3</span>
                </div>
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-3">💡 Dica</h3>
              <p className="text-gray-600">
                Comunique-se com seu parceiro! Use o chat da missão para discutir estratégias e dividir tarefas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
