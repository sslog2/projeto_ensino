import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Clock, Target, AlertTriangle, Trophy, Calendar } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';

export function RelatorioAluno() {
  const { id } = useParams();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'semana' | 'mes' | 'total'>('semana');

  const aluno = {
    id: id,
    nome: 'Pedro Costa',
    email: 'pedro.costa@escola.com',
    turma: '7º Ano B',
    nivel: 5,
    pontos: 980,
    avatar: 'basic',
    ultimoAcesso: '1 dia atrás',
    dataInscricao: '01/02/2024'
  };

  const estatisticas = {
    desafiosConcluidos: 9,
    totalDesafios: 25,
    horasEstudo: 5.2,
    tentativasMedia: 3.8,
    sequenciaDias: 3,
    melhorSequencia: 12,
    taxaSucesso: 62
  };

  const conceitosComDificuldade = [
    { conceito: 'Loops', tentativas: 8, acertos: 2, dificuldade: 'alta' },
    { conceito: 'Condicionais Aninhadas', tentativas: 6, acertos: 3, dificuldade: 'média' },
    { conceito: 'Operadores Lógicos', tentativas: 5, acertos: 2, dificuldade: 'média' }
  ];

  const historicoTentativas = [
    { id: 1, desafio: 'Laços de Repetição', data: '25/11/2024', tentativas: 5, sucesso: false, tempo: '18min' },
    { id: 2, desafio: 'Condicionais If/Else', data: '24/11/2024', tentativas: 3, sucesso: true, tempo: '12min' },
    { id: 3, desafio: 'Variáveis e Operadores', data: '23/11/2024', tentativas: 2, sucesso: true, tempo: '8min' },
    { id: 4, desafio: 'Sequências Básicas', data: '22/11/2024', tentativas: 1, sucesso: true, tempo: '5min' }
  ];

  const progressoPorModulo = [
    { modulo: 'Fundamentos', progresso: 100, cor: 'bg-green-500' },
    { modulo: 'Estruturas de Controle', progresso: 75, cor: 'bg-blue-500' },
    { modulo: 'Laços de Repetição', progresso: 33, cor: 'bg-yellow-500' },
    { modulo: 'Estruturas de Dados', progresso: 0, cor: 'bg-gray-300' }
  ];

  const graficoEngajamento = [
    { dia: 'Seg', horas: 1.2 },
    { dia: 'Ter', horas: 0.8 },
    { dia: 'Qua', horas: 0 },
    { dia: 'Qui', horas: 1.5 },
    { dia: 'Sex', horas: 0.9 },
    { dia: 'Sáb', horas: 0.5 },
    { dia: 'Dom', horas: 0.3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/turma/2" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-blue-700">Relatório do Aluno</h1>
              <p className="text-gray-600">{aluno.turma}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Perfil do Aluno */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-6 mb-6">
                <AvatarEvolutivo nivel={aluno.nivel} tipo={aluno.avatar} tamanho="lg" />
                <div className="flex-1">
                  <h2 className="text-gray-800 mb-1">{aluno.nome}</h2>
                  <p className="text-gray-600 mb-2">{aluno.email}</p>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span>Nível {aluno.nivel}</span>
                    <span>•</span>
                    <span>{aluno.pontos} pontos</span>
                    <span>•</span>
                    <span>Desde {aluno.dataInscricao}</span>
                  </div>
                </div>
                {conceitosComDificuldade.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Precisa de atenção</span>
                  </div>
                )}
              </div>

              {/* Estatísticas Rápidas */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-1">Desafios</p>
                  <p className="text-gray-900">{estatisticas.desafiosConcluidos}/{estatisticas.totalDesafios}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-1">Horas</p>
                  <p className="text-gray-900">{estatisticas.horasEstudo}h</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-1">Taxa Sucesso</p>
                  <p className="text-gray-900">{estatisticas.taxaSucesso}%</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-1">Sequência</p>
                  <p className="text-gray-900">{estatisticas.sequenciaDias} dias</p>
                </div>
              </div>
            </div>

            {/* Gráfico de Engajamento */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-800">Engajamento Semanal</h3>
                <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setPeriodoSelecionado('semana')}
                    className={`px-3 py-1 rounded-md text-sm transition-all ${
                      periodoSelecionado === 'semana' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Semana
                  </button>
                  <button
                    onClick={() => setPeriodoSelecionado('mes')}
                    className={`px-3 py-1 rounded-md text-sm transition-all ${
                      periodoSelecionado === 'mes' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Mês
                  </button>
                  <button
                    onClick={() => setPeriodoSelecionado('total')}
                    className={`px-3 py-1 rounded-md text-sm transition-all ${
                      periodoSelecionado === 'total' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Total
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between gap-2 h-48">
                {graficoEngajamento.map((item, index) => {
                  const altura = (item.horas / 2) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="flex-1 flex items-end w-full">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:opacity-80 relative group"
                          style={{ height: `${altura}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.horas}h
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 mt-2">{item.dia}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progresso por Módulo */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Progresso por Módulo</h3>
              <div className="space-y-4">
                {progressoPorModulo.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>{item.modulo}</span>
                      <span>{item.progresso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${item.cor} h-3 rounded-full transition-all`}
                        style={{ width: `${item.progresso}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico de Tentativas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-800 mb-4">Histórico Recente</h3>
              <div className="space-y-3">
                {historicoTentativas.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 ${
                      item.sucesso ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-gray-800 mb-1">{item.desafio}</h4>
                        <div className="flex items-center gap-4 text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {item.data}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {item.tempo}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          item.sucesso 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-orange-200 text-orange-800'
                        }`}>
                          {item.sucesso ? '✓ Sucesso' : '✗ Falhou'}
                        </span>
                        <p className="text-gray-600 mt-1">{item.tentativas} tentativa(s)</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alertas e Conceitos com Dificuldade */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h3 className="text-gray-800">Conceitos com Dificuldade</h3>
              </div>

              <div className="space-y-3">
                {conceitosComDificuldade.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      item.dificuldade === 'alta' ? 'bg-red-50 border-2 border-red-200' :
                      item.dificuldade === 'média' ? 'bg-orange-50 border-2 border-orange-200' :
                      'bg-yellow-50 border-2 border-yellow-200'
                    }`}
                  >
                    <p className="text-gray-800 mb-2">{item.conceito}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.tentativas} tentativas</span>
                      <span className={`${
                        item.dificuldade === 'alta' ? 'text-red-700' :
                        item.dificuldade === 'média' ? 'text-orange-700' :
                        'text-yellow-700'
                      }`}>
                        {item.acertos} acertos
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-gray-800 mb-2">💡 Recomendações</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 flex-shrink-0">•</span>
                    <span>Revisar conceitos de loops com atividades desplugadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 flex-shrink-0">•</span>
                    <span>Incentivar participação em missões colaborativas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 flex-shrink-0">•</span>
                    <span>Agendar sessão de tutoria individual</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tempo de Foco */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className="text-gray-800">Tempo de Foco</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Média por sessão</span>
                  <span className="text-gray-900">42 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maior sessão</span>
                  <span className="text-gray-900">1h 15min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total esta semana</span>
                  <span className="text-gray-900">{estatisticas.horasEstudo}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Melhor horário</span>
                  <span className="text-gray-900">14h - 16h</span>
                </div>
              </div>
            </div>

            {/* Último Acesso */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="mb-3">📅 Último Acesso</h3>
              <p className="text-blue-100 mb-4">{aluno.ultimoAcesso}</p>
              
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-white/90 text-sm">
                  {estatisticas.sequenciaDias < 5 
                    ? '⚠️ Sequência de estudos em risco. Considere enviar um lembrete motivacional.'
                    : '✓ Aluno está mantendo uma boa rotina de estudos.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
