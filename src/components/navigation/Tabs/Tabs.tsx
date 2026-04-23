import clsx from 'clsx';
import * as RadixTabs from '@radix-ui/react-tabs';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

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

  const setPropsRef = useRef(setProps);
  useEffect(() => {
    setPropsRef.current = setProps;
  }, [setProps]);

  useEffect(() => {
    setPropsRef.current({ tabIndex: internalTabIndex });
  }, [internalTabIndex]);

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
      className={clsx('ms-tabs', className)}
      {...tabProps}
    >
      <div className="ms-tabs-nav">
        <RadixTabs.List asChild>
          <ul>
            {labels.map((label, index) => (
              <li key={`tab-${index}`} className={clsx({ 'ms-is-active': internalTabIndex === index })}>
                <RadixTabs.Trigger asChild value={String(index)}>
                  <a onClick={(e) => e.preventDefault()}>
                    <span>{label}</span>
                  </a>
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
            className={clsx({ 'ms-is-hidden': !isActive })}
          >
            {(isActive || hasBeenActivated) && (
              <div className={clsx({ 'ms-is-hidden': !isActive })}>{child}</div>
            )}
          </RadixTabs.Content>
        );
      })}
    </RadixTabs.Root>
  );
};
