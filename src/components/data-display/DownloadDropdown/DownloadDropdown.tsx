import clsx from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type ReactNode, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { downloadAs, type DownloadType } from '../../../utils/download';
import '../../navigation/Dropdown/Dropdown.css';

export interface DownloadDropdownProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  buttonClassName?: string;
  data: any;
  filename?: string;
  tooltip?: string;
  children?: ReactNode;
}

export const DownloadDropdown = ({
  id,
  className,
  buttonClassName,
  data,
  filename = 'export',
  tooltip,
  children,
}: DownloadDropdownProps) => {
  const [open, setOpen] = useState(false);

  const handleDownload = (type: DownloadType) => {
    downloadAs[type](data, filename);
    setOpen(false);
  };

  const triggerButton = (
    <button
      type="button"
      className={clsx('button', buttonClassName)}
      title={tooltip}
    >
      <span>{children ?? 'Download'}</span>
      <span className="icon">
        <FaAngleDown />
      </span>
    </button>
  );

  return (
    <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
      <div
        id={id}
        data-testid="mpc-download-dropdown"
        className={clsx('mpc-download-dropdown dropdown', className, { 'is-active': open })}
      >
        <div className="dropdown-trigger">
          <DropdownMenu.Trigger asChild>{triggerButton}</DropdownMenu.Trigger>
        </div>
      </div>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="mpc-dropdown-menu dropdown-menu"
          align="end"
          sideOffset={4}
          collisionPadding={8}
        >
          <div className="mpc-dropdown-content dropdown-content">
            <DropdownMenu.Item className="dropdown-item" onSelect={() => handleDownload('json')}>
              JSON
            </DropdownMenu.Item>
            <DropdownMenu.Item className="dropdown-item" onSelect={() => handleDownload('csv')}>
              CSV
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
