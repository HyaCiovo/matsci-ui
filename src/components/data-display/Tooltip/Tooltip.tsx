import clsx from 'clsx';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type CSSProperties, type ReactElement, type ReactNode, useEffect, useState } from 'react';

export type TooltipPlace = 'top' | 'right' | 'bottom' | 'left';
export type TooltipEffect = 'solid' | 'float';

export interface TooltipProps {
  id?: string;
  setProps?: (value: any) => any;
  children?: ReactNode;
  trigger?: ReactElement;
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
    return 6;
  }

  return (value.top ?? 0) - (value.bottom ?? 0) + (value.right ?? 0) - (value.left ?? 0) + 6;
};

const renderContent = (children: ReactNode, multiline: boolean, html: boolean) => {
  const content = multiline ? (
    <div style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{children}</div>
  ) : (
    children
  );

  const style = html ? undefined : ({ whiteSpace: multiline ? 'normal' : 'nowrap' } satisfies CSSProperties);

  return { content, style };
};

export const Tooltip = ({
  trigger,
  children,
  place = 'top',
  offset,
  multiline = true,
  className,
  html = false,
  delayShow = 0,
  border = false,
  disable = false,
  scrollHide = true,
  clickable = false,
}: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const { content, style } = renderContent(children, multiline, html);

  useEffect(() => {
    if (!open || !scrollHide) {
      return;
    }

    const hide = () => setOpen(false);
    window.addEventListener('scroll', hide, true);
    return () => window.removeEventListener('scroll', hide, true);
  }, [open, scrollHide]);

  if (!trigger) {
    return null;
  }

  if (disable) {
    return trigger;
  }

  return (
    <TooltipPrimitive.Provider
      delayDuration={delayShow}
      skipDelayDuration={0}
      disableHoverableContent={!clickable}
    >
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={place}
            sideOffset={resolveOffset(offset)}
            collisionPadding={8}
            className={clsx('ms-tooltip', className)}
            data-border={border}
            data-clickable={clickable}
            style={style}
          >
            {content}
            <TooltipPrimitive.Arrow className="ms-tooltip-arrow" width={8} height={4} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
