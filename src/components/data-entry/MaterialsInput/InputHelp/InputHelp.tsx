import clsx from 'clsx';
export interface InputHelpItem {
  label?: string | null;
  examples?: string[] | null;
}

interface Props {
  items: InputHelpItem[];
  show?: boolean;
  onChange?: (value: string) => void;
}

export const InputHelp = ({ items, show, onChange }: Props) => {
  return (
    <div
      data-testid="materials-input-help-menu"
      className={clsx('ms-box ms-input-help-menu', {
        'ms-is-hidden': !show,
      })}
    >
      {items.map((item, index) => (
        <div key={`help-item-${index}`}>
          {item.examples ? (
            <div>
              {item.label ? <strong className="ms-mr-2">{item.label}:</strong> : null}
              <div className="ms-tags">
                {item.examples.map((example, exampleIndex) => (
                  <a
                    key={`help-example-${index}-${exampleIndex}`}
                    className="ms-tag ms-is-medium"
                    onMouseDown={() => onChange?.(example)}
                  >
                    {example}
                  </a>
                ))}
              </div>
            </div>
          ) : item.label ? (
            <div className="ms-is-size-7">{item.label}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
};
