import React from 'react';

interface AvatarEvolutivoProps {
  nivel: number;
  tipo?: string;
  tamanho?: 'sm' | 'md' | 'lg';
}

export function AvatarEvolutivo({ nivel, tipo = 'basic', tamanho = 'lg' }: AvatarEvolutivoProps) {
  const tamanhos = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const cores = nivel < 5 ? 'from-gray-400 to-gray-600' :
                nivel < 10 ? 'from-blue-400 to-blue-600' :
                nivel < 15 ? 'from-purple-400 to-purple-600' :
                'from-yellow-400 to-orange-500';

  return (
    <div className="relative inline-block">
      <div className={`${tamanhos[tamanho]} bg-gradient-to-br ${cores} rounded-full flex items-center justify-center shadow-lg`}>
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
          {/* Corpo */}
          <circle cx="50" cy="40" r="15" fill="white" opacity="0.9" />
          <rect x="35" y="50" width="30" height="35" rx="5" fill="white" opacity="0.9" />
          
          {/* Olhos */}
          <circle cx="44" cy="38" r="2" fill="#333" />
          <circle cx="56" cy="38" r="2" fill="#333" />
          
          {/* Sorriso */}
          <path d="M 43 45 Q 50 48 57 45" stroke="#333" strokeWidth="2" fill="none" />
          
          {/* Acessórios baseados no nível */}
          {nivel >= 5 && (
            <path d="M 35 30 L 50 25 L 65 30 L 60 35 L 40 35 Z" fill="#FFD700" />
          )}
          
          {nivel >= 10 && (
            <>
              <rect x="30" y="55" width="8" height="20" fill="#FFD700" opacity="0.7" />
              <rect x="62" y="55" width="8" height="20" fill="#FFD700" opacity="0.7" />
            </>
          )}
        </svg>
      </div>
      
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-1 shadow-md border-2 border-purple-600">
        <span className="text-purple-700">{nivel}</span>
      </div>
    </div>
  );
}
