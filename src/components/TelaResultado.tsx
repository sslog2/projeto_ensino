import React, { useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Trophy, Star, TrendingUp, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { calcularProgressoNivel } from '../utils/leveling';

export function TelaResultado() {
  const { desafioId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, atualizarUsuario } = useAuth();

  const sucesso = searchParams.get('sucesso') === 'true';
  const pontos = parseInt(searchParams.get('pontos') || '0');
  const estrelasUrl = parseInt(searchParams.get('estrelas') || (sucesso ? '3' : '1'));

  const progressoInfo = calcularProgressoNivel((user?.pontos || 0) + (sucesso ? pontos : 0));

  const resultados = {
    sucesso,
    pontos,
    estrelas: estrelasUrl,
    tempoExecucao: '12s',
    tentativas: 3,
    medalhas: sucesso ? ['Primeira Tentativa', 'Código Eficiente'] : [],
    progressoNivel: progressoInfo.porcentagem,
    pontosRestantes: progressoInfo.pontosRestantes
  };

  useEffect(() => {
    if (sucesso && user) {
      // Atualizar pontos do usuário
      atualizarUsuario({
        pontos: (user.pontos || 0) + pontos
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animação de Resultado */}
        <div className="text-center mb-8">
          {sucesso ? (
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl mb-4 animate-bounce">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow-2xl mb-4">
              <RotateCcw className="w-16 h-16 text-white" />
            </div>
          )}
          
          <h1 className={`mb-2 ${sucesso ? 'text-yellow-600' : 'text-gray-700'}`}>
            {sucesso ? 'Parabéns! 🎉' : 'Quase lá! 💪'}
          </h1>
          <p className="text-gray-600">
            {sucesso ? 'Você completou o desafio com sucesso!' : 'Continue tentando, você está no caminho certo!'}
          </p>
        </div>

        {/* Card de Resultado */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {/* Estrelas */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className={`w-12 h-12 ${
                  i <= resultados.estrelas
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Pontos Ganhos */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-100 to-blue-100 px-8 py-4 rounded-full">
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
              <span className="text-purple-700">+{resultados.pontos} pontos</span>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600 mb-1">Tempo</p>
              <p className="text-gray-900">{resultados.tempoExecucao}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600 mb-1">Tentativas</p>
              <p className="text-gray-900">{resultados.tentativas}</p>
            </div>
          </div>

          {/* Medalhas Conquistadas */}
          {resultados.medalhas.length > 0 && (
            <div className="mb-6">
              <h3 className="text-gray-800 mb-3">🏅 Medalhas Conquistadas</h3>
              <div className="space-y-2">
                {resultados.medalhas.map((medalha, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-3"
                  >
                    <Trophy className="w-6 h-6 text-yellow-600" />
                    <span className="text-gray-800">{medalha}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progresso do Nível */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-800">Progresso do Nível</h3>
              <span className="text-gray-600">{resultados.progressoNivel}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${resultados.progressoNivel}%` }}
              />
            </div>
            <p className="text-gray-600 mt-2">Faltam {resultados.pontosRestantes} pontos para o nível {progressoInfo.nivel + 1}!</p>
          </div>

          {/* Feedback Personalizado */}
          {sucesso ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                ✨ Excelente trabalho! Sua solução foi eficiente e bem estruturada. 
                Continue assim e logo você será um mestre da programação!
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                💡 Dica: Tente revisar a sequência de blocos. Você está muito perto de conseguir!
                Lembre-se de usar os blocos de repetição para otimizar seu código.
              </p>
            </div>
          )}

          {/* Ações */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              to={`/desafio/${desafioId}`}
              className="py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-center flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Tentar Novamente
            </Link>
            <Link
              to="/mapa-desafios"
              className="py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
            >
              Próximo Desafio
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Link para Dashboard */}
        <div className="text-center">
          <Link to="/dashboard-aluno" className="text-purple-600 hover:text-purple-700">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
