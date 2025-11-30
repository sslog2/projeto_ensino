import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, senha: string, tipo: 'aluno' | 'professor') => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string, tipo: 'aluno' | 'professor', codigoTurma?: string) => Promise<void>;
  logout: () => void;
  atualizarUsuario: (dados: Partial<Usuario>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);

  const login = async (email: string, senha: string, tipo: 'aluno' | 'professor') => {
    // Simulação de login
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (tipo === 'aluno') {
      setUser({
        id: '1',
        nome: 'João Silva',
        email,
        tipo: 'aluno',
        turmaId: 'turma-1',
        nivel: 5,
        pontos: 1250,
        avatar: {
          corpo: 'warrior',
          olhos: 'happy',
          acessorio: 'helmet'
        }
      });
    } else {
      setUser({
        id: 'prof-1',
        nome: 'Prof. Maria Santos',
        email,
        tipo: 'professor'
      });
    }
  };

  const cadastrar = async (nome: string, email: string, senha: string, tipo: 'aluno' | 'professor', codigoTurma?: string) => {
    // Simulação de cadastro
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (tipo === 'aluno') {
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        nome,
        email,
        tipo: 'aluno',
        turmaId: codigoTurma || 'turma-1',
        nivel: 1,
        pontos: 0,
        avatar: {
          corpo: 'basic',
          olhos: 'normal',
          acessorio: 'none'
        }
      });
    } else {
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        nome,
        email,
        tipo: 'professor'
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const atualizarUsuario = (dados: Partial<Usuario>) => {
    if (user) {
      setUser({ ...user, ...dados });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, cadastrar, logout, atualizarUsuario }}>
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
