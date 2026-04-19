import clsx from 'clsx';
import { Bell as BellIcon } from 'lucide-react';

interface BellProps {
  className?: string;
  showBadge?: boolean;
  showNumber?: boolean;
  badgeNumber?: string;
}

export const Bell = ({ className, showBadge, showNumber, badgeNumber }: BellProps) => (
  <span className="notification-bell">
    <BellIcon className={clsx('notification-bell-icon', className)} />
    {showBadge ? (
      <span className={clsx('notification-badge', { 'has-number': showNumber })}>
        {showNumber ? badgeNumber : null}
      </span>
    ) : null}
  </span>
);
