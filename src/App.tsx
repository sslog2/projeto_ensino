import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { AccessibilityToolbar } from "./components/AccessibilityToolbar";
import { LoginCadastro } from "./components/LoginCadastro";
import { DashboardAluno } from "./components/DashboardAluno";
import { DashboardProfessor } from "./components/DashboardProfessor";
import { MapaDesafios } from "./components/MapaDesafios";
import { EditorBlocos } from "./components/EditorBlocos";
import { TelaResultado } from "./components/TelaResultado";
import { PerfilAluno } from "./components/PerfilAluno";
import { RankingTurma } from "./components/RankingTurma";
import { GerenciamentoTurmas } from "./components/GerenciamentoTurmas";
import { DetalheTurma } from "./components/DetalheTurma";
import { RelatorioAluno } from "./components/RelatorioAluno";
import { CriarDesafio } from "./components/CriarDesafio";
import { DesplugadoGuiado } from "./components/DesplugadoGuiado";
import { DesplugadoAluno } from "./components/DesplugadoAluno";
import { TooltipProvider } from "./components/ui/tooltip";

function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "aluno" | "professor";
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.tipo !== requiredRole) {
    return (
      <Navigate
        to={
          user.tipo === "aluno"
            ? "/dashboard-aluno"
            : "/dashboard-professor"
        }
        replace
      />
    );
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to={
                user.tipo === "aluno"
                  ? "/dashboard-aluno"
                  : "/dashboard-professor"
              }
              replace
            />
          ) : (
            <LoginCadastro />
          )
        }
      />

      {/* Rotas do Aluno */}
      <Route
        path="/dashboard-aluno"
        element={
          <ProtectedRoute requiredRole="aluno">
            <DashboardAluno />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mapa-desafios"
        element={
          <ProtectedRoute requiredRole="aluno">
            <MapaDesafios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/desafio/:id"
        element={
          <ProtectedRoute requiredRole="aluno">
            <EditorBlocos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resultado/:desafioId"
        element={
          <ProtectedRoute requiredRole="aluno">
            <TelaResultado />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute requiredRole="aluno">
            <PerfilAluno />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ranking"
        element={
          <ProtectedRoute requiredRole="aluno">
            <RankingTurma />
          </ProtectedRoute>
        }
      />
      <Route
        path="/desplugado-aluno"
        element={
          <ProtectedRoute requiredRole="aluno">
            <DesplugadoAluno />
          </ProtectedRoute>
        }
      />

      {/* Rotas do Professor */}
      <Route
        path="/dashboard-professor"
        element={
          <ProtectedRoute requiredRole="professor">
            <DashboardProfessor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/turmas"
        element={
          <ProtectedRoute requiredRole="professor">
            <GerenciamentoTurmas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/turma/:id"
        element={
          <ProtectedRoute requiredRole="professor">
            <DetalheTurma />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aluno/:id"
        element={
          <ProtectedRoute requiredRole="professor">
            <RelatorioAluno />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professor/criar-desafio"
        element={
          <ProtectedRoute requiredRole="professor">
            <CriarDesafio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/desplugado"
        element={
          <ProtectedRoute requiredRole="professor">
            <DesplugadoGuiado />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AccessibilityProvider>
        <TooltipProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <AccessibilityToolbar />
              <main className="flex-1">
                <AppRoutes />
              </main>
            </div>
          </AuthProvider>
        </TooltipProvider>
      </AccessibilityProvider>
    </Router>
  );
}