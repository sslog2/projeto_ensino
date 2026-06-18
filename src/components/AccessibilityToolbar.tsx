import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { 
  Type, 
  Contrast, 
  Focus, 
  Plus, 
  Minus
} from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export const AccessibilityToolbar = () => {
  const { 
    increaseFontSize, 
    decreaseFontSize, 
    toggleHighContrast, 
    toggleFocusMode,
    highContrast,
    focusMode
  } = useAccessibility();

  return (
    <div className="accessibility-toolbar bg-white dark:bg-zinc-900 border-b p-2 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-4 sticky top-0 z-[100] shadow-sm print:hidden">
      <div className="flex items-center gap-2 border-r-0 sm:border-r pr-0 sm:pr-4">
        <span className="text-sm font-medium flex items-center gap-1">
          <Type size={16} color="currentColor" /> Fonte:
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={decreaseFontSize} aria-label="Diminuir tamanho da fonte">
              <Minus size={14} color="currentColor" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Diminuir fonte</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={increaseFontSize} aria-label="Aumentar tamanho da fonte">
              <Plus size={14} color="currentColor" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Aumentar fonte</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={highContrast ? "default" : "outline"} 
              size="sm"
              className="h-8 text-xs sm:text-sm"
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
            >
              <Contrast size={16} className="mr-1 sm:mr-2" color="currentColor" />
              Alto Contraste
            </Button>
          </TooltipTrigger>
          <TooltipContent>Alternar Alto Contraste (WCAG AAA)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={focusMode ? "default" : "outline"} 
              size="sm"
              className="h-8 text-xs sm:text-sm"
              onClick={toggleFocusMode}
              aria-pressed={focusMode}
            >
              <Focus size={16} className="mr-1 sm:mr-2" color="currentColor" />
              Modo Foco
            </Button>
          </TooltipTrigger>
          <TooltipContent>Modo Foco (Esconde distrações)</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
