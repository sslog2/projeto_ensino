import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { calcularNivel } from '../utils/leveling';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'aluno' | 'professor';
  turmaId?: string;
  nivel?: number;
  pontos?: number;
  avatar?: {
    corpo: string;
    olhos: string;
    acessorio: string;
  };
  necessidades_cognitivas?: boolean;
}

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string, tipo: 'aluno' | 'professor', codigoTurma?: string) => Promise<void>;
  logout: () => Promise<void>;
  atualizarUsuario: (dados: Partial<Usuario>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual ao carregar
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user.id, session.user.email!);
      }
      setLoading(false);
    };

    checkSession();

    // Ouvir mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (id: string, email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Perfil não encontrado no banco público (usuário órfão após reset)
        console.warn('Sessão ativa mas perfil não encontrado. Deslogando...');
        await supabase.auth.signOut();
        setUser(null);
      } else {
        console.error('Erro ao buscar perfil:', error);
      }
      return;
    }

    if (data) {
      const pontosReais = data.pontos || 0;
      setUser({
        id: data.id,
        nome: data.nome,
        email: email,
        tipo: data.tipo,
        nivel: calcularNivel(pontosReais), // Calcula na hora ao carregar
        pontos: pontosReais,
        avatar: data.avatar_data,
        necessidades_cognitivas: data.necessidades_cognitivas || false
      });
    }
  };

  const login = async (email: string, senha: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) throw error;
  };

  const cadastrar = async (nome: string, email: string, senha: string, tipo: 'aluno' | 'professor', codigoTurma?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome,
          tipo,
        }
      }
    });

    if (error) throw error;

    // Se houver código de turma e for aluno, vincular à turma
    if (tipo === 'aluno' && codigoTurma && data.user) {
      try {
        // 1. Buscar a turma pelo código
        const { data: turma, error: errorTurma } = await supabase
          .from('turmas')
          .select('id')
          .eq('codigo', codigoTurma.toUpperCase())
          .single();

        if (errorTurma) {
          console.error('Código de turma inválido:', errorTurma);
          return;
        }

        if (turma) {
          // 2. Criar o vínculo na tabela alunos_turmas
          const { error: errorVinculo } = await supabase
            .from('alunos_turmas')
            .insert([
              { aluno_id: data.user.id, turma_id: turma.id }
            ]);

          if (errorVinculo) console.error('Erro ao vincular aluno à turma:', errorVinculo);
        }
      } catch (err) {
        console.error('Erro no processo de vinculação:', err);
      }
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Erro no logout:', error);
    setUser(null);
  };

  const atualizarUsuario = async (dados: Partial<Usuario>) => {
    if (!user) return;

    // Recalcular nível se os pontos mudarem
    const novosPontos = dados.pontos !== undefined ? dados.pontos : user.pontos;
    const novoNivel = calcularNivel(novosPontos || 0);

    const updatePayload: any = {
      nome: dados.nome,
      nivel: novoNivel,
      pontos: novosPontos,
      avatar_data: dados.avatar
    };

    if (dados.necessidades_cognitivas !== undefined) {
      updatePayload.necessidades_cognitivas = dados.necessidades_cognitivas;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id);

    if (error) throw error;

    setUser(prev => prev ? { ...prev, ...dados, nivel: novoNivel, pontos: novosPontos } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, cadastrar, logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
