import clsx from 'clsx';
import { useState } from 'react';
import { Link } from '../Link';
import { isUrl } from '../../../utils/navigation';
import { Modal, ModalContextProvider, ModalTrigger } from '../../data-display/Modal';
import type { NavbarItem } from '../Navbar/types';

export interface NavbarDropdownProps {
  className?: string;
  items?: NavbarItem[];
  isArrowless?: boolean;
  isRight?: boolean;
  isActiveOnClick?: boolean;
  isModal?: boolean;
  displayDot?: boolean;
  children?: React.ReactNode;
}

const renderNavbarItem = (
  item: NavbarItem,
  key: string,
  onClose?: () => void
) => {
  if (item.isDivider) {
    return <hr className="ms-navbar-divider" key={key} />;
  }

  if (item.isMenuLabel) {
    return (
      <span className="ms-navbar-item ms-menu-label" key={key}>
        {item.label}
      </span>
    );
  }

  if (item.href && isUrl(item.href)) {
    return (
      <a
        key={key}
        href={item.href}
        target={item.target}
        rel={item.target === '_blank' ? 'noreferrer' : undefined}
        className={clsx('ms-navbar-item', item.className)}
        onClick={onClose}
      >
        {item.label}
      </a>
    );
  }

  return (
    <span onClick={onClose} key={key}>
      <Link href={item.href || ''} className={clsx('ms-navbar-item', item.className)}>
        {item.label}
      </Link>
    </span>
  );
};

export const NavbarDropdown = ({
  className,
  items = [],
  isArrowless = false,
  isRight = false,
  isActiveOnClick = false,
  isModal = false,
  children,
}: NavbarDropdownProps) => {
  const [isActive, setIsActive] = useState(false);

  const dropdownContent = isModal ? (
    <div className={clsx('ms-navbar-dropdown', { 'ms-is-right': isRight })}>
      {items.map((item, index) => (
        <div key={`modal-item-${index}`} onClick={(event) => event.stopPropagation()}>
          <ModalContextProvider>
            <ModalTrigger>
              <span className="ms-navbar-item">{item.label}</span>
            </ModalTrigger>
            <Modal>
              <div className="ms-panel">
                <div className="ms-panel-heading">{item.header}</div>
                <div className="ms-panel-block ms-p-5">{item.content}</div>
              </div>
            </Modal>
          </ModalContextProvider>
        </div>
      ))}
    </div>
  ) : (
    <>
      <a className={clsx('ms-navbar-link', { 'ms-is-arrowless': isArrowless })}>{children}</a>
      <div className={clsx('ms-navbar-dropdown', { 'ms-is-right': isRight })}>
        {items.map((item, index) => renderNavbarItem(item, `navbar-dropdown-item-${index}`, () => setIsActive(false)))}
      </div>
    </>
  );

  if (isModal || isActiveOnClick) {
    return (
      <div
        data-testid="navbar-dropdown"
        className={clsx('ms-navbar-item ms-has-dropdown', className, { 'ms-is-active': isActive })}
        onClick={() => setIsActive((current) => !current)}
      >
        {isModal ? (
          <>
            <a className={clsx('ms-navbar-link', { 'ms-is-arrowless': isArrowless })}>{children}</a>
            {dropdownContent}
          </>
        ) : (
          dropdownContent
        )}
      </div>
    );
  }

  return (
    <div
      data-testid="navbar-dropdown"
      className={clsx('ms-navbar-item ms-has-dropdown', className, { 'ms-is-active': isActive })}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      {dropdownContent}
    </div>
  );
};
