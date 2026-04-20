import clsx from 'clsx';
import { Children, cloneElement, isValidElement, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import './Dropdown.css';

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
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const renderedItems = children ? Children.toArray(children) : items;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | globalThis.MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleItemSelection = (event?: MouseEvent<HTMLElement>) => {
    if (!closeOnSelection) {
      return;
    }

    if (event?.defaultPrevented) {
      return;
    }

    setOpen(false);
  };

  const handleItemKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemSelection();
    }
  };

  return (
    <div
      ref={dropdownRef}
      data-testid="mpc-dropdown"
      id={id}
      className={clsx('dropdown', className, {
        'is-active': open,
        'is-up': isUp,
        'is-right': isRight,
      })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className={clsx(triggerClassName)}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {renderIcon(triggerIcon)}
          {triggerLabel ? <span>{triggerLabel}</span> : null}
          {!isArrowless ? (
            <span className="icon">{isUp ? <FaAngleUp /> : <FaAngleDown />}</span>
          ) : null}
        </button>
      </div>
      {open ? (
        <div className="mpc-dropdown-menu dropdown-menu" role="menu">
          <div className="mpc-dropdown-content dropdown-content" role="presentation">
            {renderedItems.map((item, index) => {
              if (typeof item === 'string' || typeof item === 'number') {
                return (
                  <div
                    key={index}
                    className="dropdown-item"
                    role="menuitem"
                    tabIndex={0}
                    onClick={() => handleItemSelection()}
                    onKeyDown={handleItemKeyDown}
                  >
                    {item}
                  </div>
                );
              }

              if (isValidElement(item)) {
                const originalOnClick = (item.props as { onClick?: (event: MouseEvent<HTMLElement>) => void }).onClick;
                return cloneElement(item, {
                  key: item.key ?? index,
                  onClick: (event: MouseEvent<HTMLElement>) => {
                    originalOnClick?.(event);
                    handleItemSelection(event);
                  },
                });
              }

              return (
                <div
                  key={index}
                  className="dropdown-item"
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => handleItemSelection()}
                  onKeyDown={handleItemKeyDown}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
