import clsx from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface DropdownProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  triggerLabel?: string;
  triggerClassName?: string;
  triggerIcon?: string | ReactNode;
  items?: ReactNode[];
  isArrowless?: boolean;
  isUp?: boolean;
  isRight?: boolean;
  closeOnSelection?: boolean;
  children?: ReactNode;
}

const renderIcon = (triggerIcon?: string | ReactNode) => {
  if (!triggerIcon) {
    return null;
  }

  return typeof triggerIcon === 'string' ? <i className={triggerIcon} /> : triggerIcon;
};

export const Dropdown = ({
  id,
  className,
  triggerLabel,
  triggerClassName = 'button',
  triggerIcon,
  items = [],
  isArrowless = false,
  isUp = false,
  isRight = false,
  closeOnSelection = true,
  children,
}: DropdownProps) => {
  const renderedItems = children ? (Array.isArray(children) ? children : [children]) : items;

  return (
    <DropdownMenu.Root modal={false}>
      <div
        data-testid="mpc-dropdown"
        id={id}
        className={clsx('dropdown is-active', className, {
          'is-up': isUp,
          'is-right': isRight,
        })}
      >
        <div className="dropdown-trigger">
          <DropdownMenu.Trigger asChild>
            <button type="button" className={clsx(triggerClassName)}>
              {renderIcon(triggerIcon)}
              {triggerLabel ? <span>{triggerLabel}</span> : null}
              {!isArrowless ? (
                <span className="icon">{isUp ? <ChevronUp /> : <ChevronDown />}</span>
              ) : null}
            </button>
          </DropdownMenu.Trigger>
        </div>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="dropdown-content"
            align={isRight ? 'end' : 'start'}
            side={isUp ? 'top' : 'bottom'}
            sideOffset={4}
          >
            {renderedItems.map((item, index) => {
              const itemProps = closeOnSelection
                ? undefined
                : {
                    onSelect: (event: Event) => {
                      event.preventDefault();
                    },
                  };

              if (typeof item === 'string' || typeof item === 'number') {
                return (
                  <DropdownMenu.Item key={index} className="dropdown-item" {...itemProps}>
                    {item}
                  </DropdownMenu.Item>
                );
              }

              return (
                <DropdownMenu.Item key={index} asChild {...itemProps}>
                  {item as React.ReactElement}
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </div>
    </DropdownMenu.Root>
  );
};
