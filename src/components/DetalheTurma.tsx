import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, TrendingDown, AlertTriangle, Trophy, Target } from 'lucide-react';
import { AvatarEvolutivo } from './AvatarEvolutivo';

export function DetalheTurma() {
  const { id } = useParams();
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'pontos' | 'progresso'>('pontos');

  const turma = {
    id: id,
    nome: '7º Ano A',
    codigo: 'TURMA2024A',
    alunos: 28,
    metaSemanal: 85,
    pontosTotal: 8500
  };

  const alunos = [
    {
      id: 1,
      nome: 'Carlos Souza',
      nivel: 8,
      pontos: 2450,
      progresso: 85,
      ultimoAcesso: '1 hora atrás',
      desafiosConcluidos: 18,
      tendencia: 'up',
      alertas: 0,
      avatar: 'mage'
    },
    {
      id: 2,
      nome: 'Ana Lima',
      nivel: 7,
      pontos: 2180,
      progresso: 78,
      ultimoAcesso: '2 horas atrás',
      desafiosConcluidos: 16,
      tendencia: 'up',
      alertas: 0,
      avatar: 'warrior'
    },
    {
      id: 3,
      nome: 'João Silva',
      nivel: 5,
      pontos: 1250,
      progresso: 60,
      ultimoAcesso: '3 horas atrás',
      desafiosConcluidos: 12,
      tendencia: 'stable',
      alertas: 0,
      avatar: 'warrior'
    },
    {
      id: 4,
      nome: 'Maria Santos',
      nivel: 6,
      pontos: 1180,
      progresso: 55,
      ultimoAcesso: '5 horas atrás',
      desafiosConcluidos: 11,
      tendencia: 'down',
      alertas: 1,
      avatar: 'basic'
    },
    {
      id: 5,
      nome: 'Pedro Costa',
      nivel: 5,
      pontos: 980,
      progresso: 48,
      ultimoAcesso: '1 dia atrás',
      desafiosConcluidos: 9,
      tendencia: 'down',
      alertas: 2,
      avatar: 'basic'
    }
  ];

  const alunosFiltrados = alunos
    .filter(aluno => aluno.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => {
      if (ordenacao === 'nome') return a.nome.localeCompare(b.nome);
      if (ordenacao === 'pontos') return b.pontos - a.pontos;
      if (ordenacao === 'progresso') return b.progresso - a.progresso;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/turmas" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-blue-700">{turma.nome}</h1>
              <p className="text-gray-600">{turma.alunos} alunos • Código: {turma.codigo}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Cards de Estatísticas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Target className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-gray-600 mb-1">Meta Semanal</p>
            <p className="text-gray-900">{turma.metaSemanal}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
            <p className="text-gray-600 mb-1">Pontos Total</p>
            <p className="text-gray-900">{turma.pontosTotal}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-gray-600 mb-1">Média de Progresso</p>
            <p className="text-gray-900">65%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <AlertTriangle className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-gray-600 mb-1">Alertas</p>
            <p className="text-gray-900">3 alunos</p>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar aluno..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as any)}
                className="w-full md:w-auto px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              >
                <option value="nome">Ordenar por Nome</option>
                <option value="pontos">Ordenar por Pontos</option>
                <option value="progresso">Ordenar por Progresso</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Alunos */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-700">Aluno</th>
                  <th className="px-6 py-4 text-left text-gray-700">Nível</th>
                  <th className="px-6 py-4 text-left text-gray-700">Pontos</th>
                  <th className="px-6 py-4 text-left text-gray-700">Progresso</th>
                  <th className="px-6 py-4 text-left text-gray-700">Desafios</th>
                  <th className="px-6 py-4 text-left text-gray-700">Último Acesso</th>
                  <th className="px-6 py-4 text-left text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alunosFiltrados.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AvatarEvolutivo nivel={aluno.nivel} tipo={aluno.avatar} tamanho="sm" />
                        <div>
                          <p className="text-gray-800">{aluno.nome}</p>
                          {aluno.alertas > 0 && (
                            <div className="flex items-center gap-1 text-orange-600 mt-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span className="text-xs">{aluno.alertas} alerta(s)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{aluno.nivel}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-700">{aluno.pontos}</span>
                        {aluno.tendencia === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {aluno.tendencia === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{aluno.progresso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              aluno.progresso >= 70 ? 'bg-green-500' :
                              aluno.progresso >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${aluno.progresso}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{aluno.desafiosConcluidos}/25</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{aluno.ultimoAcesso}</span>
                    </td>
                    <td className="px-6 py-4">
                      {aluno.alertas > 0 ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          Atenção
                        </span>
                      ) : aluno.progresso >= 70 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Ótimo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/aluno/${aluno.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Ver Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
