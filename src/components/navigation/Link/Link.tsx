import { type CSSProperties, type MouseEvent, type ReactNode } from 'react';

const createPushStateEvent = () => {
  if (typeof window.CustomEvent === 'function') {
    return new window.CustomEvent('_dashprivate_pushstate');
  }

  const event = document.createEvent('CustomEvent');
  event.initCustomEvent('_dashprivate_pushstate', false, false, undefined);
  return event;
};

export interface LinkProps {
  children?: ReactNode;
  href: string;
  target?: string;
  refresh?: boolean;
  title?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
  loading_state?: { is_loading?: boolean } | null;
  preserveQuery?: boolean;
}

export const Link = ({
  children,
  href,
  target,
  refresh = false,
  title,
  className,
  style,
  id,
  loading_state,
  preserveQuery = false,
}: LinkProps) => {
  const resolvedHref = preserveQuery ? `${href}${window.location.search}` : href;

  const updateLocation = (event: MouseEvent<HTMLAnchorElement>) => {
    const hasModifiers = event.metaKey || event.shiftKey || event.altKey || event.ctrlKey;
    if (hasModifiers) {
      return;
    }

    if (target && target !== '_self') {
      return;
    }

    event.preventDefault();
    if (refresh) {
      window.location.assign(resolvedHref);
    } else {
      window.history.pushState({}, '', resolvedHref);
      window.dispatchEvent(createPushStateEvent());
    }

    window.scrollTo(0, 0);
  };

  return (
    <a
      id={id}
      className={className}
      style={style}
      href={resolvedHref}
      onClick={updateLocation}
      title={title}
      target={target}
      data-dash-is-loading={loading_state?.is_loading || undefined}
    >
      {children ?? resolvedHref}
    </a>
  );
};
