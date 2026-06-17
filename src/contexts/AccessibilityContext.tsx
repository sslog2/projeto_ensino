import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  fontSize: number;
  highContrast: boolean;
  focusMode: boolean;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
  toggleFocusMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('access-font-size');
    return saved ? parseInt(saved, 10) : 16;
  });

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('access-high-contrast');
    return saved === 'true';
  });

  const [focusMode, setFocusMode] = useState(() => {
    const saved = localStorage.getItem('access-focus-mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('access-font-size', fontSize.toString());
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('access-high-contrast', highContrast.toString());
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('access-focus-mode', focusMode.toString());
    if (focusMode) {
      document.documentElement.classList.add('focus-mode');
    } else {
      document.documentElement.classList.remove('focus-mode');
    }
  }, [focusMode]);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleFocusMode = () => setFocusMode(prev => !prev);

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      highContrast,
      focusMode,
      increaseFontSize,
      decreaseFontSize,
      toggleHighContrast,
      toggleFocusMode
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
