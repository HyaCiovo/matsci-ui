import clsx from 'clsx';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Drawer.css';
import { ModalCloseButton } from '../Modal/ModalCloseButton/ModalCloseButton';
import { useDrawerContext } from './DrawerContextProvider';

const DRAWER_TRANSITION_MS = 500;
const DRAWER_ACTIVATE_GAP_MS = 20;
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
type DrawerPhase = 'closed' | 'opening' | 'open' | 'closing';

export interface DrawerProps {
  id: string;
  setProps?: (value: any) => any;
  className?: string;
  position?: DrawerPosition;
  duration?: number;
  children?: React.ReactNode;
}

export const Drawer = ({
  id,
  className,
  position = 'right',
  duration = DRAWER_TRANSITION_MS,
  children,
}: DrawerProps) => {
  const { activeDrawer, setActiveDrawer } = useDrawerContext();
  const isActive = activeDrawer === id;
  const [isMounted, setIsMounted] = useState(false);
  const [phase, setPhase] = useState<DrawerPhase>('closed');
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<DrawerPhase>('closed');
  const activateTimerRef = useRef<number | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (activateTimerRef.current) {
      window.clearTimeout(activateTimerRef.current);
      activateTimerRef.current = null;
    }
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (isActive) {
      if (phaseRef.current === 'opening' || phaseRef.current === 'open') {
        return;
      }

      setIsMounted(true);
      setPhase('closed');
      return;
    }

    if (phaseRef.current === 'closed' || phaseRef.current === 'closing') {
      return;
    }

    setPhase('closing');
    closeTimerRef.current = window.setTimeout(() => {
      setPhase('closed');
      setIsMounted(false);
      closeTimerRef.current = null;
    }, duration);

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [duration, isActive]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isMounted || !isActive || phase !== 'closed') {
      return;
    }

    // Force the browser to commit the closed state before switching to opening.
    void drawerRef.current?.offsetWidth;

    activateTimerRef.current = window.setTimeout(() => {
      setPhase('opening');
      activateTimerRef.current = null;
    }, DRAWER_ACTIVATE_GAP_MS);

    return () => {
      if (activateTimerRef.current) {
        window.clearTimeout(activateTimerRef.current);
        activateTimerRef.current = null;
      }
    };
  }, [isActive, isMounted, phase]);

  useEffect(() => {
    if (typeof window === 'undefined' || phase !== 'opening') {
      return;
    }

    openTimerRef.current = window.setTimeout(() => {
      setPhase('open');
      openTimerRef.current = null;
    }, duration);

    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
    };
  }, [duration, phase]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isActive) {
        setActiveDrawer(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      if (activateTimerRef.current) {
        window.clearTimeout(activateTimerRef.current);
      }
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
      }
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [isActive, setActiveDrawer]);

  if (!isMounted || typeof document === 'undefined') {
    return null;
  }

  const style = {
    '--mpc-drawer-duration': `${duration}ms`,
  } as CSSProperties;

  return createPortal(
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="false"
      className={clsx('mpc-drawer', className)}
      data-position={position}
      data-phase={phase}
      style={style}
    >
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        Drawer
      </div>
      <ModalCloseButton onClick={() => setActiveDrawer(null)} />
      {children}
    </div>,
    document.body
  );
};
