import classNames from 'classnames';
import type { ReactNode } from 'react';
import './DataCard.css';

interface KeyLabelPair {
  key: string;
  label: string;
}

export interface DataCardProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: Record<string, any>;
  levelOneKey?: string;
  levelTwoKey?: string;
  levelThreeKeys?: KeyLabelPair[];
  leftComponent?: ReactNode;
}

export const DataCard = ({
  id,
  className,
  data,
  levelOneKey,
  levelTwoKey,
  levelThreeKeys,
  leftComponent,
}: DataCardProps) => {
  return (
    <div id={id} className={classNames('mpc-data-card', className)}>
      <div className="mpc-data-card-left">{leftComponent}</div>
      <div className="mpc-data-card-right">
        {levelOneKey ? <p className="title is-4">{data[levelOneKey]}</p> : null}
        {levelTwoKey ? <p className="subtitle">{data[levelTwoKey]}</p> : null}
        <div className="mpc-data-card-right-bottom">
          {[0, 1].map((columnGroup) => (
            <div key={columnGroup}>
              {levelThreeKeys
                ?.slice(columnGroup * 2, columnGroup * 2 + 2)
                .map((item) => (
                  <div key={item.key}>
                    <p>{item.label}</p>
                    <p>{data[item.key] || '-'}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
