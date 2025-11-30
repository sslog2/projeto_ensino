import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginCadastro } from "./components/LoginCadastro";
import { DashboardAluno } from "./components/DashboardAluno";
import { DashboardProfessor } from "./components/DashboardProfessor";
import { MapaDesafios } from "./components/MapaDesafios";
import { EditorBlocos } from "./components/EditorBlocos";
import { TelaResultado } from "./components/TelaResultado";
import { PerfilAluno } from "./components/PerfilAluno";
import { RankingTurma } from "./components/RankingTurma";
import { MissoesColaborativas } from "./components/MissoesColaborativas";
import { GerenciamentoTurmas } from "./components/GerenciamentoTurmas";
import { DetalheTurma } from "./components/DetalheTurma";
import { RelatorioAluno } from "./components/RelatorioAluno";
import { DesplugadoGuiado } from "./components/DesplugadoGuiado";

function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "aluno" | "professor";
}) {
  const { user } = useAuth();

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
  const { user } = useAuth();

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
        path="/missoes"
        element={
          <ProtectedRoute requiredRole="aluno">
            <MissoesColaborativas />
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
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}