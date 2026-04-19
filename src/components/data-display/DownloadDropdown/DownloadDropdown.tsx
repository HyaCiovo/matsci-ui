import clsx from 'clsx';
import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { downloadAs, type DownloadType } from '../../../utils/download';

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

  return (
    <div
      id={id}
      data-testid="mpc-download-dropdown"
      className={clsx('mpc-download-dropdown dropdown', className, { 'is-active': open })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className={clsx('button', buttonClassName)}
          data-tooltip={tooltip}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{children ?? 'Download'}</span>
          <span className="icon">
            <ChevronDown />
          </span>
        </button>
      </div>
      {open ? (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            <button type="button" className="dropdown-item" onClick={() => handleDownload('json')}>
              JSON
            </button>
            <button type="button" className="dropdown-item" onClick={() => handleDownload('csv')}>
              CSV
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
