import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Code2, Sparkles } from 'lucide-react';

export function LoginCadastro() {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [tipo, setTipo] = useState<'aluno' | 'professor'>('aluno');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [codigoTurma, setCodigoTurma] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, cadastrar } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (modo === 'login') {
        await login(email, senha, tipo);
      } else {
        await cadastrar(nome, email, senha, tipo, tipo === 'aluno' ? codigoTurma : undefined);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <Code2 className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-white mb-2">CodeQuest</h1>
          <p className="text-white/80">Aprenda programação de forma divertida!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setModo('login')}
              className={`flex-1 py-2 rounded-md transition-all ${
                modo === 'login' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setModo('cadastro')}
              className={`flex-1 py-2 rounded-md transition-all ${
                modo === 'cadastro' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Tipo de usuário */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTipo('aluno')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                tipo === 'aluno'
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              <Sparkles className="w-5 h-5 inline-block mr-2" />
              Aluno
            </button>
            <button
              onClick={() => setTipo('professor')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                tipo === 'professor'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              <Code2 className="w-5 h-5 inline-block mr-2" />
              Professor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {modo === 'cadastro' && (
              <div>
                <label className="block text-gray-700 mb-2">Nome completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              />
            </div>

            {modo === 'cadastro' && tipo === 'aluno' && (
              <div>
                <label className="block text-gray-700 mb-2">Código da turma</label>
                <input
                  type="text"
                  value={codigoTurma}
                  onChange={(e) => setCodigoTurma(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="Ex: TURMA2024"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Carregando...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
