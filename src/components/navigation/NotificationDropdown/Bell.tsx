import classNames from 'classnames';
import { FaBell } from 'react-icons/fa';

interface BellProps {
  className?: string;
  showBadge?: boolean;
  showNumber?: boolean;
  badgeNumber?: string;
}

export const Bell = ({ className, showBadge, showNumber, badgeNumber }: BellProps) => (
  <span className="notification-bell">
    <FaBell className={classNames('notification-bell-icon', className)} />
    {showBadge ? (
      <span className={classNames('notification-badge', { 'has-number': showNumber })}>
        {showNumber ? badgeNumber : null}
      </span>
    ) : null}
  </span>
);
