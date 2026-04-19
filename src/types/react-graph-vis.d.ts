declare module 'react-graph-vis' {
  import type { ComponentType } from 'react';

  export interface GraphVisProps {
    graph: {
      nodes?: unknown[];
      edges?: unknown[];
      [key: string]: unknown;
    };
    options?: Record<string, unknown>;
    events?: Record<string, (...args: unknown[]) => void>;
    getNetwork?: (network: unknown) => void;
    getEdges?: (edges: unknown) => void;
    getNodes?: (nodes: unknown) => void;
  }

  const Graph: ComponentType<GraphVisProps>;
  export default Graph;
}
