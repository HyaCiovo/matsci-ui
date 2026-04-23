import clsx from 'clsx';
import { FaBell } from 'react-icons/fa';

interface BellProps {
  className?: string;
  showBadge?: boolean;
  showNumber?: boolean;
  badgeNumber?: string;
}

export const Bell = ({ className, showBadge, showNumber, badgeNumber }: BellProps) => {
  if (showBadge) {
    if (showNumber) {
      return (
        <span className="ms-notification-badge ms-fa-stack ms-bell-icon">
          <span className="ms-fa-stack-2x ms-has-badge-number" data-count={badgeNumber}>
            <FaBell className={clsx('ms-fa-stack-1x ms-fa-inverse', className)} />
          </span>
        </span>
      );
    }

    return (
      <span className="ms-notification-badge ms-fa-stack ms-bell-icon">
        <span className="ms-fa-stack-2x ms-has-badge" data-count="0">
          <FaBell className={clsx('ms-fa-stack-1x ms-fa-inverse', className)} />
        </span>
      </span>
    );
  }

  return (
    <span className="ms-fa-stack ms-bell-icon">
      <FaBell className={clsx('ms-fa-stack-2x ms-fa-inverse', className)} />
    </span>
  );
};
