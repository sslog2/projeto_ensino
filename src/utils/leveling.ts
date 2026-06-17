/**
 * Lógica de Leveling Progressivo
 * Nível 1: 0 pts
 * Nível 2: 100 pts (+100)
 * Nível 3: 300 pts (+200)
 * Nível 4: 600 pts (+300)
 * ...
 * Fórmula: Pontos Totais para Nível N = 50 * N * (N - 1)
 */

export const calcularNivel = (pontos: number): number => {
  // Resolvendo a equação quadrática: 50n^2 - 50n - pontos = 0
  // n = [50 + sqrt(2500 + 200 * pontos)] / 100
  const nivel = Math.floor((50 + Math.sqrt(2500 + 200 * pontos)) / 100);
  return Math.max(1, nivel);
};

export const pontosParaNivel = (nivel: number): number => {
  if (nivel <= 1) return 0;
  return 50 * nivel * (nivel - 1);
};

export const calcularProgressoNivel = (pontos: number) => {
  const nivelAtual = calcularNivel(pontos);
  const pontosBase = pontosParaNivel(nivelAtual);
  const pontosProxNivel = pontosParaNivel(nivelAtual + 1);
  
  const progressoNoNivel = pontos - pontosBase;
  const pontosNecessariosNoNivel = pontosProxNivel - pontosBase;
  
  const porcentagem = Math.min(100, Math.max(0, (progressoNoNivel / pontosNecessariosNoNivel) * 100));
  
  return {
    nivel: nivelAtual,
    porcentagem: Math.round(porcentagem),
    pontosRestantes: pontosProxNivel - pontos
  };
};
