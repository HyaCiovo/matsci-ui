import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

interface DrawerState {
  activeDrawer: string | null;
  setActiveDrawer: (value: string | null) => void;
}

const DrawerContext = createContext<DrawerState | undefined>(undefined);

export interface DrawerContextProviderProps {
  children?: ReactNode;
}

export const DrawerContextProvider = ({ children }: DrawerContextProviderProps) => {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const value = useMemo(() => ({ activeDrawer, setActiveDrawer }), [activeDrawer]);

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
};

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawerContext must be used within a DrawerContextProvider');
  }
  return context;
};
