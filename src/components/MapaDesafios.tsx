import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Star, Lock, CheckCircle, Trophy, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export function MapaDesafios() {
  const { user } = useAuth();
  const [desafios, setDesafios] = useState<any[]>([]);
  const [progresso, setProgresso] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDados();
    }
  }, [user]);

  const fetchDados = async () => {
    try {
      setLoading(true);
      
      // 1. Buscar todos os desafios
      const { data: desafiosData, error: errorDesafios } = await supabase
        .from('desafios')
        .select('*')
        .order('id', { ascending: true });

      if (errorDesafios) throw errorDesafios;

      // 2. Buscar progresso do aluno
      const { data: progressoData, error: errorProgresso } = await supabase
        .from('progresso_alunos')
        .select('*')
        .eq('aluno_id', user?.id);

      if (errorProgresso) throw errorProgresso;

      setDesafios(desafiosData || []);
      setProgresso(progressoData || []);
    } catch (error) {
      console.error('Erro ao buscar dados do mapa:', error);
    } finally {
      setLoading(false);
    }
  };

  const isConcluido = (desafioId: number) => {
    return progresso.some(p => p.desafio_id === desafioId && p.concluido);
  };

  const getDificuldadeCor = (dificuldade: string) => {
    switch(dificuldade) {
      case 'Fácil': return 'text-green-600 bg-green-100';
      case 'Médio': return 'text-yellow-600 bg-yellow-100';
      case 'Difícil': return 'text-orange-600 bg-orange-100';
      case 'Muito Difícil': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalConcluidos = progresso.filter(p => p.concluido).length;
  const porcentagemProgresso = desafios.length > 0 ? (totalConcluidos / desafios.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

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
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-1000" 
              style={{ width: `${porcentagemProgresso}%` }} 
            />
          </div>
          <p className="text-gray-600 mt-2">{totalConcluidos} de {desafios.length} desafios concluídos</p>
        </div>

        {/* Lista de Desafios */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-gray-800">Trilha de Aprendizado</h2>
              <p className="text-gray-600">Domine os fundamentos da lógica</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {desafios.map((desafio) => {
              const concluido = isConcluido(desafio.id);
              return (
                <Link
                  key={desafio.id}
                  to={`/desafio/${desafio.id}`}
                  className={`block p-4 rounded-lg border-2 transition-all ${
                    concluido
                      ? 'border-green-400 bg-green-50 hover:shadow-md'
                      : 'border-purple-300 bg-white hover:border-purple-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {concluido ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-purple-400" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${getDificuldadeCor(desafio.dificuldade)}`}>
                      {desafio.dificuldade}
                    </span>
                  </div>
                  <h3 className="text-gray-800 mb-1">{desafio.titulo}</h3>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{desafio.pontos_recompensa} pts</span>
                  </div>
                </Link>
              );
            })}

            {desafios.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                <p>Nenhum desafio disponível no momento. Aguarde as instruções do professor!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
