import clsx from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type ReactNode, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { downloadAs, type DownloadType } from '../../../utils/download';
import { mergeTexts } from '../../../utils/text';

export interface DownloadDropdownProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  buttonClassName?: string;
  data: any;
  filename?: string;
  tooltip?: string;
  children?: ReactNode;
  texts?: Partial<DownloadDropdownTexts>;
}

export interface DownloadDropdownTexts {
  defaultFilename: string;
  buttonLabel: string;
  json: string;
  csv: string;
}

const DEFAULT_TEXTS: DownloadDropdownTexts = {
  defaultFilename: 'export',
  buttonLabel: 'Download',
  json: 'JSON',
  csv: 'CSV',
};

export const DownloadDropdown = ({
  id,
  className,
  buttonClassName,
  data,
  filename: filenameProp,
  tooltip,
  children,
  texts: textsProp,
}: DownloadDropdownProps) => {
  const texts = mergeTexts(DEFAULT_TEXTS, textsProp);
  const filename = filenameProp ?? texts.defaultFilename;
  const [open, setOpen] = useState(false);

  const handleDownload = (type: DownloadType) => {
    downloadAs[type](data, filename);
    setOpen(false);
  };

  const triggerButton = (
    <button
      type="button"
      className={clsx('ms-button', buttonClassName)}
      title={tooltip}
    >
      <span>{children ?? texts.buttonLabel}</span>
      <span className="ms-icon">
        <FaAngleDown />
      </span>
    </button>
  );

  return (
    <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
      <div
        id={id}
        data-testid="ms-download-dropdown"
        className={clsx('ms-download-dropdown ms-dropdown', className, { 'ms-is-active': open })}
      >
        <div className="ms-dropdown-trigger">
          <DropdownMenu.Trigger asChild>{triggerButton}</DropdownMenu.Trigger>
        </div>
      </div>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="ms-dropdown-menu"
          align="end"
          sideOffset={4}
          collisionPadding={8}
        >
          <div className="ms-dropdown-content">
            <DropdownMenu.Item className="ms-dropdown-item" onSelect={() => handleDownload('json')}>
              {texts.json}
            </DropdownMenu.Item>
            <DropdownMenu.Item className="ms-dropdown-item" onSelect={() => handleDownload('csv')}>
              {texts.csv}
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
