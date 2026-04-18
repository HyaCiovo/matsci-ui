import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface ModalState {
  active: boolean;
  setActive: (value: boolean) => void;
  forceAction: boolean;
  setForceAction: (value: boolean) => void;
}

export interface ModalContextProviderProps {
  setProps?: (value: any) => any;
  active?: boolean;
  forceAction?: boolean;
  children?: ReactNode;
}

const ModalContext = createContext<ModalState | undefined>(undefined);

export const ModalContextProvider = ({
  setProps = () => null,
  active = false,
  forceAction = false,
  children,
}: ModalContextProviderProps) => {
  const [isActive, setIsActive] = useState(active);
  const [isForceAction, setIsForceAction] = useState(forceAction);

  useEffect(() => {
    if (isActive) {
      document.documentElement.classList.add('is-clipped');
    } else {
      document.documentElement.classList.remove('is-clipped');
    }

    setProps({ active: isActive });
    return () => {
      document.documentElement.classList.remove('is-clipped');
    };
  }, [isActive, setProps]);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  useEffect(() => {
    setIsForceAction(forceAction);
  }, [forceAction]);

  const value = useMemo(
    () => ({
      active: isActive,
      setActive: setIsActive,
      forceAction: isForceAction,
      setForceAction: setIsForceAction,
    }),
    [isActive, isForceAction]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalContextProvider');
  }
  return context;
};
