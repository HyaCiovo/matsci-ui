import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { Markdown } from '../../data-display/Markdown';
import { Modal, ModalContextProvider, ModalTrigger } from '../../data-display/Modal';
import { Bell } from './Bell';
import './NotificationDropdown.css';

export interface NotificationItem {
  className?: string;
  label?: string;
  href?: string;
  content?: string;
  header?: string;
  isRead?: boolean;
  id?: string;
}

export interface NotificationDropdownProps {
  className?: string;
  id?: string;
  notifyLevel?: string;
  hasUnread?: boolean;
  isHidden?: boolean;
  items: NotificationItem[];
  isRight?: boolean;
  isModal?: boolean;
  link?: string;
}

export const NotificationDropdown = ({
  className,
  id,
  notifyLevel,
  hasUnread = false,
  isHidden = false,
  items = [],
  isRight = false,
  link,
}: NotificationDropdownProps) => {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [unreadMessages, setUnreadMessages] = useState(
    items.map((item) => ({ id: item.id, isRead: item.isRead ?? false }))
  );
  const [hasUnreadMessages, setHasUnreadMessages] = useState(hasUnread);

  useEffect(() => {
    setUnreadMessages(items.map((item) => ({ id: item.id, isRead: item.isRead ?? false })));
  }, [items]);

  useEffect(() => {
    setHasUnreadMessages(
      hasUnread || unreadMessages.some((message) => !message.isRead)
    );
  }, [hasUnread, unreadMessages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isMessageLevel = useMemo(
    () => notifyLevel?.toLowerCase() === 'message',
    [notifyLevel]
  );

  const handleItemClick = (messageId?: string) => {
    if (!isMessageLevel) {
      return;
    }

    setUnreadMessages((current) =>
      current.map((message) => (message.id === messageId ? { ...message, isRead: true } : message))
    );
  };

  if (isHidden) {
    return <div />;
  }

  return (
    <div
      id={id}
      ref={dropdownRef}
      data-testid="notification-dropdown"
      className={classNames('navbar-item has-dropdown', className, { 'is-active': isActive })}
      onClick={() => {
        setIsActive((current) => !current);
        if (!isMessageLevel) {
          setHasUnreadMessages(false);
        }
      }}
    >
      <a className={classNames('navbar-link', 'is-arrowless')}>
        <Bell showBadge={hasUnreadMessages} />
      </a>

      <div className={classNames('navbar-dropdown', { 'is-right': isRight })}>
        {items.map((item, index) => (
          <div
            key={`notification-item-${index}`}
            onClick={(event) => {
              event.stopPropagation();
              handleItemClick(item.id);
            }}
          >
            <ModalContextProvider>
              <ModalTrigger>
                <a className={classNames('navbar-item', item.className)}>
                  {isMessageLevel && !unreadMessages.find((message) => message.id === item.id)?.isRead ? (
                    <FaCircle className="notification-dot" />
                  ) : null}
                  {item.label}
                </a>
              </ModalTrigger>
              <Modal>
                <div className="panel">
                  <div className="panel-heading">{item.header}</div>
                  <div className="panel-block p-5">
                    <Markdown>{item.content ?? ' '}</Markdown>
                  </div>
                </div>
              </Modal>
            </ModalContextProvider>
          </div>
        ))}

        {link ? (
          <a className={classNames('navbar-item', 'more')} href={link} target="_blank" rel="noreferrer">
            More
          </a>
        ) : null}
      </div>
    </div>
  );
};
