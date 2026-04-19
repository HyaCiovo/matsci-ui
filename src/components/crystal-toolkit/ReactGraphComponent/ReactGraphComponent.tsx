// @ts-nocheck
import { useEffect, useRef } from 'react';
import Graph from 'react-graph-vis';

export interface ReactGraphComponentProps {
  id?: string;
  graph?: {
    nodes?: unknown[];
    edges?: unknown[];
    [key: string]: unknown;
  };
  options?: Record<string, unknown>;
  setProps?: (value: any) => any;
}

type GraphNetwork = {
  fit?: () => void;
  nodes?: unknown;
  edges?: unknown;
};

export function ReactGraphComponent(props: ReactGraphComponentProps) {
  const networkRef = useRef<GraphNetwork | null>(null);

  useEffect(() => {
    if (props.graph?.nodes && props.graph?.edges && networkRef.current) {
      networkRef.current.nodes = props.graph.nodes;
      networkRef.current.edges = props.graph.edges;
      networkRef.current.fit?.();
    }
  }, [props.graph?.edges, props.graph?.nodes]);

  return (
    <Graph
      graph={props.graph ?? { nodes: [], edges: [] }}
      options={props.options}
      getNetwork={(network: unknown) => {
        networkRef.current = network as GraphNetwork;
      }}
    />
  );
}

export default ReactGraphComponent;
