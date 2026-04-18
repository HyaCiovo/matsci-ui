import classNames from 'classnames';
import { type ReactNode } from 'react';
import { downloadAs, type DownloadType } from '../../../utils/download';

export interface DownloadButtonProps {
  id?: string;
  className?: string;
  data: unknown;
  filename?: string;
  filetype?: DownloadType;
  tooltip?: string;
  children?: ReactNode;
}

export const DownloadButton = ({
  id,
  className,
  data,
  filename = 'export',
  filetype = 'json',
  tooltip,
  children,
}: DownloadButtonProps) => {
  return (
    <button
      type="button"
      id={id}
      className={classNames('mpc-download-button', className)}
      data-tooltip={tooltip}
      onClick={() => downloadAs[filetype](data, filename)}
    >
      {children ?? 'Download'}
    </button>
  );
};
