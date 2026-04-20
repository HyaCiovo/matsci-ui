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
        <span className="notification-badge fa-stack bell-icon">
          <span className="fa-stack-2x has-badge-number" data-count={badgeNumber}>
            <FaBell className={clsx('fa-stack-1x fa-inverse', className)} />
          </span>
        </span>
      );
    }

    return (
      <span className="notification-badge fa-stack bell-icon">
        <span className="fa-stack-2x has-badge" data-count="0">
          <FaBell className={clsx('fa-stack-1x fa-inverse', className)} />
        </span>
      </span>
    );
  }

  return (
    <span className="fa-stack bell-icon">
      <FaBell className={clsx('fa-stack-2x fa-inverse', className)} />
    </span>
  );
};
