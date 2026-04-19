import type { PropsWithChildren } from 'react';

export function PeriodicTablePluginWrapper(props: PropsWithChildren) {
  return (
    <>
      <span className="first-span"></span>
      <span className="second-span">{props.children}</span>
    </>
  );
}
