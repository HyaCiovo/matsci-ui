import clsx from 'clsx';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset as floatingOffset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';
import './Tooltip.css';

export type TooltipPlace = 'top' | 'right' | 'bottom' | 'left';
export type TooltipEffect = 'solid' | 'float';

export interface TooltipProps {
  id?: string;
  setProps?: (value: any) => any;
  children?: ReactNode;
  place?: TooltipPlace;
  effect?: TooltipEffect;
  event?: string;
  eventOff?: string;
  globalEventOff?: string;
  offset?: Partial<Record<'left' | 'right' | 'top' | 'bottom', number>>;
  multiline?: boolean;
  className?: string;
  html?: boolean;
  delayHide?: number;
  delayShow?: number;
  border?: boolean;
  disable?: boolean;
  scrollHide?: boolean;
  clickable?: boolean;
}

const resolveOffset = (value?: TooltipProps['offset']) => {
  if (!value) {
    return 8;
  }

  return (value.top ?? 0) - (value.bottom ?? 0) + (value.right ?? 0) - (value.left ?? 0) + 8;
};

export const Tooltip = ({
  id,
  children,
  place = 'top',
  offset,
  multiline = true,
  className,
  html = false,
  delayHide = 0,
  delayShow = 350,
  border = false,
  disable = false,
  scrollHide = true,
}: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const [referenceEl, setReferenceEl] = useState<HTMLElement | null>(null);
  const showTimeoutRef = useRef<number>();
  const hideTimeoutRef = useRef<number>();

  const { refs, floatingStyles } = useFloating({
    placement: place,
    open,
    whileElementsMounted: autoUpdate,
    middleware: [floatingOffset(resolveOffset(offset)), flip(), shift({ padding: 8 })],
  });

  useEffect(() => {
    if (referenceEl) {
      refs.setReference(referenceEl);
    }
  }, [referenceEl, refs]);

  useEffect(() => {
    if (!id || disable) {
      return;
    }

    const triggers = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-for="${id}"], [data-tooltip-id="${id}"]`)
    );

    const clearTimers = () => {
      if (showTimeoutRef.current) {
        window.clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };

    const show = (target: HTMLElement) => {
      clearTimers();
      showTimeoutRef.current = window.setTimeout(() => {
        setReferenceEl(target);
        setOpen(true);
      }, delayShow);
    };

    const hide = () => {
      clearTimers();
      hideTimeoutRef.current = window.setTimeout(() => setOpen(false), delayHide);
    };

    const handleMouseEnter = (event: Event) => show(event.currentTarget as HTMLElement);
    const handleFocus = (event: Event) => show(event.currentTarget as HTMLElement);

    triggers.forEach((trigger) => {
      trigger.addEventListener('mouseenter', handleMouseEnter);
      trigger.addEventListener('mouseleave', hide);
      trigger.addEventListener('focus', handleFocus);
      trigger.addEventListener('blur', hide);
    });

    return () => {
      clearTimers();
      triggers.forEach((trigger) => {
        trigger.removeEventListener('mouseenter', handleMouseEnter);
        trigger.removeEventListener('mouseleave', hide);
        trigger.removeEventListener('focus', handleFocus);
        trigger.removeEventListener('blur', hide);
      });
    };
  }, [delayHide, delayShow, disable, id]);

  useEffect(() => {
    if (!open || !scrollHide) {
      return;
    }

    const hide = () => setOpen(false);
    window.addEventListener('scroll', hide, true);
    return () => window.removeEventListener('scroll', hide, true);
  }, [open, scrollHide]);

  if (!id || disable || !open || !referenceEl) {
    return null;
  }

  const content = multiline ? (
    <div style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{children}</div>
  ) : (
    children
  );

  const style = html ? undefined : ({ whiteSpace: multiline ? 'normal' : 'nowrap' } satisfies CSSProperties);

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        role="tooltip"
        style={{ ...floatingStyles, ...style }}
        className={clsx('mpc-tooltip', className)}
        data-border={border}
      >
        {content}
      </div>
    </FloatingPortal>
  );
};
