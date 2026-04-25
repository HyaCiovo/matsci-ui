import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { FaAngleDown, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from '../Link';
import { NavbarDropdown } from '../NavbarDropdown';
import { isUrl } from '../../../utils/navigation';
import type { NavbarItem } from './types';

export interface NavbarProps {
  id?: string;
  className?: string;
  items: NavbarItem[];
  children?: React.ReactNode;
  brandItem: NavbarItem;
  ariaLabel?: string;
  brandAltFallback?: string;
}

const Icon = ({ icon }: { icon?: string }) =>
  icon ? (
    <span className="ms-icon">
      <i className={icon}></i>
    </span>
  ) : null;

const normalizePath = (path?: string) => {
  if (!path) {
    return '/';
  }

  const pathname = path.startsWith('http://') || path.startsWith('https://') ? new URL(path).pathname : path;
  const trimmed = pathname.split('?')[0]?.split('#')[0] || '/';
  if (trimmed === '/') {
    return '/';
  }

  return trimmed.replace(/\/+$/, '') || '/';
};

const getCurrentPath = () => {
  if (typeof window === 'undefined') {
    return '/';
  }

  return normalizePath(window.location.pathname);
};

const isItemActive = (item: NavbarItem, currentPath: string): boolean => {
  if (item.href && !isUrl(item.href) && normalizePath(item.href) === currentPath) {
    return true;
  }

  return item.items?.some((child) => isItemActive(child, currentPath)) ?? false;
};

const InternalOrExternalLink = ({
  item,
  className,
}: {
  item: NavbarItem;
  className?: string;
}) => {
  if (item.href && isUrl(item.href)) {
    return (
      <a
        className={clsx('ms-navbar-item', className, item.className)}
        href={item.href}
        target={item.target}
        rel={item.target === '_blank' ? 'noreferrer' : undefined}
      >
        <Icon icon={item.icon} />
        {item.label}
      </a>
    );
  }

  return (
    <Link className={clsx('ms-navbar-item', className, item.className)} href={item.href || ''}>
      <Icon icon={item.icon} />
      {item.label}
    </Link>
  );
};

export const Navbar = ({
  id,
  className,
  items = [],
  brandItem,
  children,
  ariaLabel = 'main navigation',
  brandAltFallback = 'brand',
}: NavbarProps) => {
  const [activeMobile, setActiveMobile] = useState(false);
  const [mobileOpenGroups, setMobileOpenGroups] = useState<Record<string, boolean>>({});
  const [currentPath, setCurrentPath] = useState(getCurrentPath);

  useEffect(() => {
    const syncPath = () => setCurrentPath(getCurrentPath());

    window.addEventListener('popstate', syncPath);
    window.addEventListener('_dashprivate_pushstate', syncPath as EventListener);

    return () => {
      window.removeEventListener('popstate', syncPath);
      window.removeEventListener('_dashprivate_pushstate', syncPath as EventListener);
    };
  }, []);

  return (
    <nav
      id={id}
      className={clsx('ms-navbar', className)}
      role="navigation"
      aria-label={ariaLabel}
    >
      <div className="ms-navbar-brand">
        <Link
          className={clsx('ms-navbar-item', brandItem.className, {
            'ms-is-active': isItemActive(brandItem, currentPath),
          })}
          href={brandItem.href || ''}
        >
          {brandItem.image ? <img src={brandItem.image} alt={brandItem.label || brandAltFallback} /> : null}
          {!brandItem.image ? <Icon icon={brandItem.icon} /> : null}
          {brandItem.label}
        </Link>
        <button
          data-testid="navbar-burger-open"
          type="button"
          className="ms-navbar-burger"
          onClick={() => setActiveMobile(true)}
        >
          <FaBars />
        </button>
      </div>

      <div className="ms-navbar-menu">
        <div className="ms-navbar-end">
          {items.map((item, index) =>
            item.items ? (
              <NavbarDropdown
                key={`navbar-item-${index}`}
                className={clsx('ms-navbar-item', item.className, {
                  'ms-is-active': isItemActive(item, currentPath),
                })}
                items={item.items}
                isArrowless={item.isArrowless}
                isRight={item.isRight}
                isActiveOnClick={item.isActiveOnClick}
                isModal={item.isModal}
              >
                <Icon icon={item.icon} />
                {item.label}
              </NavbarDropdown>
            ) : (
              <InternalOrExternalLink
                item={item}
                key={`navbar-item-${index}`}
                className={clsx({ 'ms-is-active': isItemActive(item, currentPath) })}
              />
            )
          )}
          {children}
        </div>
      </div>

      <div data-testid="navbar-mobile" className={clsx('ms-navbar-mobile', { 'ms-is-active': activeMobile })}>
        <div className="ms-navbar-brand">
          <Link
            className={clsx('ms-navbar-item', brandItem.className, {
              'ms-is-active': isItemActive(brandItem, currentPath),
            })}
            href={brandItem.href || ''}
          >
            {brandItem.image ? <img src={brandItem.image} alt={brandItem.label || brandAltFallback} /> : null}
            {!brandItem.image ? <Icon icon={brandItem.icon} /> : null}
            {!brandItem.image && !brandItem.icon ? brandItem.label : null}
          </Link>
          <button
            data-testid="navbar-burger-close"
            type="button"
            className="ms-navbar-burger"
            onClick={() => setActiveMobile(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className="ms-navbar-mobile-menu">
          {items.map((item, index) => {
            if (!item.items) {
              return (
                <InternalOrExternalLink
                  item={item}
                  key={`navbar-mobile-item-${index}`}
                  className={clsx({ 'ms-is-active': isItemActive(item, currentPath) })}
                />
              );
            }

            const open = !!mobileOpenGroups[item.label || String(index)];
            return (
              <div
                key={`navbar-mobile-item-${index}`}
                className={clsx(item.className, {
                  'ms-is-active': isItemActive(item, currentPath),
                })}
              >
                <a
                  className={clsx('ms-navbar-item ms-navbar-item-toggle', {
                    'ms-is-active': isItemActive(item, currentPath),
                  })}
                  onClick={() =>
                    setMobileOpenGroups((current) => ({
                      ...current,
                      [item.label || String(index)]: !open,
                    }))
                  }
                >
                  <span>
                    <Icon icon={item.icon} />
                    {item.label}
                  </span>
                  <FaAngleDown />
                </a>

                {open ? (
                  <div className="ms-navbar-dropdown">
                    {item.items.map((innerItem, innerIndex) =>
                      innerItem.isMenuLabel ? (
                        <span className="ms-navbar-item ms-menu-label" key={`navbar-mobile-inner-item-${innerIndex}`}>
                          {innerItem.label}
                        </span>
                      ) : (
                        <InternalOrExternalLink
                          item={innerItem}
                          key={`navbar-mobile-inner-item-${innerIndex}`}
                        />
                      )
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={clsx('ms-modal-background', { 'ms-is-hidden-by-opacity': !activeMobile })}
        onClick={() => setActiveMobile(false)}
      ></div>
    </nav>
  );
};
