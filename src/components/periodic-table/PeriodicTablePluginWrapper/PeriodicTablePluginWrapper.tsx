import type { PropsWithChildren } from 'react';

export function PeriodicTablePluginWrapper(props: PropsWithChildren) {
  return (
    <>
      <span className="ms-first-span"></span>
      <span className="ms-second-span">{props.children}</span>
    </>
  );
}
