import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

type ViewMode = 'agent' | 'client';

interface ViewModeContextValue {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isClient: boolean;
}

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

const VIEW_MODE_KEY = 'propa_view_mode';

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setMode] = useState<ViewMode>(() => {
    return (localStorage.getItem(VIEW_MODE_KEY) as ViewMode) || 'agent';
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    setMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (viewMode === 'client') {
      root.classList.add('client-mode');
    } else {
      root.classList.remove('client-mode');
    }
  }, [viewMode]);

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, isClient: viewMode === 'client' }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error('useViewMode must be used within ViewModeProvider');
  return ctx;
}
