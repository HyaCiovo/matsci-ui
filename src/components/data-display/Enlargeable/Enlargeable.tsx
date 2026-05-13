import clsx from 'clsx';
import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCompress, FaExpand } from 'react-icons/fa';

export interface EnlargeableProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  expanded?: boolean;
  setExpanded?: Dispatch<SetStateAction<boolean>>;
  hideButton?: boolean;
  children?: ReactNode;
}

export const Enlargeable = ({
  id,
  className = '',
  expanded: controlledExpanded,
  setExpanded: controlledSetExpanded,
  hideButton = false,
  children,
}: EnlargeableProps) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const expanded = controlledExpanded ?? internalExpanded;
  const setExpanded = controlledSetExpanded ?? setInternalExpanded;

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    if (!expanded || typeof document === 'undefined') {
      return;
    }

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = 'hidden';
    documentElement.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [expanded]);

  const content = (
    <>
      <div
        className={clsx({
          'ms-modal-background': expanded,
        })}
        data-slot="overlay-backdrop"
        onClick={() => setExpanded(false)}
      />
      <div
        className={clsx({
          'ms-modal-content ms-is-large': expanded,
        })}
        data-slot="overlay-content"
      >
        {!hideButton ? (
          <button className="ms-button ms-enlarge-button" data-slot="overlay-toggle" onClick={() => setExpanded(!expanded)}>
            {expanded ? <FaCompress /> : <FaExpand />}
          </button>
        ) : null}
        {children}
      </div>
    </>
  );

  if (expanded && portalRoot) {
    return createPortal(
      <div
        id={id}
        className={clsx('ms-enlargeable', className, 'ms-modal ms-is-active')}
        data-slot="overlay-root"
      >
        {content}
      </div>,
      portalRoot
    );
  }

  return (
    <div
      id={id}
      className={clsx('ms-enlargeable', className)}
      data-slot="overlay-root"
    >
      {content}
    </div>
  );
};
