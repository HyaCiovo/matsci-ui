import clsx from 'clsx';
import * as RadixTabs from '@radix-ui/react-tabs';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

export interface TabsProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  children?: ReactNode;
  labels: string[];
  tabIndex?: number;
  arbitraryProps?: object;
}

export const Tabs = ({
  setProps = () => null,
  className,
  labels,
  tabIndex = 0,
  arbitraryProps,
  children,
  ...otherProps
}: TabsProps) => {
  const tabProps = { ...otherProps, ...arbitraryProps };
  const [internalTabIndex, setInternalTabIndex] = useState(tabIndex);
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([tabIndex]));
  const childArray = useMemo(() => (Array.isArray(children) ? children : [children]), [children]);

  useEffect(() => {
    setProps({ tabIndex: internalTabIndex });
  }, [internalTabIndex, setProps]);

  useEffect(() => {
    setInternalTabIndex(tabIndex);
    setVisitedTabs((current) => new Set(current).add(tabIndex));
  }, [tabIndex]);

  const currentValue = String(internalTabIndex);

  return (
    <RadixTabs.Root
      value={currentValue}
      onValueChange={(value) => {
        const nextIndex = Number(value);
        setInternalTabIndex(nextIndex);
        setVisitedTabs((current) => new Set(current).add(nextIndex));
      }}
      className={clsx('mpc-tabs', className)}
      {...tabProps}
    >
      <div className="tabs">
        <RadixTabs.List asChild>
          <ul>
            {labels.map((label, index) => (
              <li key={`tab-${index}`} className={clsx({ 'is-active': internalTabIndex === index })}>
                <RadixTabs.Trigger asChild value={String(index)}>
                  <button type="button">
                    <span>{label}</span>
                  </button>
                </RadixTabs.Trigger>
              </li>
            ))}
          </ul>
        </RadixTabs.List>
      </div>
      {childArray.map((child, index) => {
        const isActive = internalTabIndex === index;
        const hasBeenActivated = visitedTabs.has(index);

        return (
          <RadixTabs.Content
            key={`tab-panel-${index}`}
            value={String(index)}
            forceMount
            className={clsx({ 'is-hidden': !isActive })}
          >
            {(isActive || hasBeenActivated) && (
              <div className={clsx({ 'is-hidden': !isActive })}>{child}</div>
            )}
          </RadixTabs.Content>
        );
      })}
    </RadixTabs.Root>
  );
};
