import clsx from 'clsx';
import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link } from '../Link';
import { NavbarDropdown } from '../NavbarDropdown';
import { isUrl } from '../../../utils/navigation';
import './Navbar.css';
import type { NavbarItem } from './types';

export interface NavbarProps {
  id?: string;
  className?: string;
  items: NavbarItem[];
  children?: React.ReactNode;
  brandItem: NavbarItem;
}

const Icon = ({ icon }: { icon?: string }) =>
  icon ? (
    <span className="icon">
      <i className={icon}></i>
    </span>
  ) : null;

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
        className={clsx('navbar-item', className, item.className)}
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
    <Link className={clsx('navbar-item', className, item.className)} href={item.href || ''}>
      <Icon icon={item.icon} />
      {item.label}
    </Link>
  );
};

export const Navbar = ({ id, className, items = [], brandItem, children }: NavbarProps) => {
  const [activeMobile, setActiveMobile] = useState(false);
  const [mobileOpenGroups, setMobileOpenGroups] = useState<Record<string, boolean>>({});

  return (
    <nav
      id={id}
      className={clsx('navbar', className)}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link className={clsx('navbar-item', brandItem.className)} href={brandItem.href || ''}>
          {brandItem.image ? <img src={brandItem.image} alt={brandItem.label || 'brand'} /> : null}
          {!brandItem.image ? <Icon icon={brandItem.icon} /> : null}
          {brandItem.label}
        </Link>
        <button
          data-testid="navbar-burger-open"
          type="button"
          className="navbar-burger"
          onClick={() => setActiveMobile(true)}
        >
          <Menu />
        </button>
      </div>

      <div className="navbar-menu">
        <div className="navbar-end">
          {items.map((item, index) =>
            item.items ? (
              <NavbarDropdown
                key={`navbar-item-${index}`}
                className={clsx('navbar-item', item.className)}
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
              <InternalOrExternalLink item={item} key={`navbar-item-${index}`} />
            )
          )}
          {children}
        </div>
      </div>

      <div data-testid="navbar-mobile" className={clsx('navbar-mobile', { 'is-active': activeMobile })}>
        <div className="navbar-brand">
          <Link className={clsx('navbar-item', brandItem.className)} href={brandItem.href || ''}>
            {brandItem.image ? <img src={brandItem.image} alt={brandItem.label || 'brand'} /> : null}
            {!brandItem.image ? <Icon icon={brandItem.icon} /> : null}
            {!brandItem.image && !brandItem.icon ? brandItem.label : null}
          </Link>
          <button
            data-testid="navbar-burger-close"
            type="button"
            className="navbar-burger"
            onClick={() => setActiveMobile(false)}
          >
            <X />
          </button>
        </div>

        <div className="navbar-mobile-menu">
          {items.map((item, index) => {
            if (!item.items) {
              return <InternalOrExternalLink item={item} key={`navbar-mobile-item-${index}`} />;
            }

            const open = !!mobileOpenGroups[item.label || String(index)];
            return (
              <div key={`navbar-mobile-item-${index}`} className={item.className}>
                <button
                  type="button"
                  className="navbar-item navbar-item-toggle"
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
                  <ChevronDown />
                </button>

                {open ? (
                  <div className="navbar-dropdown">
                    {item.items.map((innerItem, innerIndex) =>
                      innerItem.isMenuLabel ? (
                        <span className="navbar-item menu-label" key={`navbar-mobile-inner-item-${innerIndex}`}>
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
        className={clsx('modal-background', { 'is-hidden-by-opacity': !activeMobile })}
        onClick={() => setActiveMobile(false)}
      ></div>
    </nav>
  );
};
