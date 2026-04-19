import ReactJson from '@microlink/react-json-view';
import type { CSSProperties } from 'react';

export interface JsonViewProps {
  type?: 'array' | 'object';
  src?: Record<string, any> | null;
  name?: boolean | string;
  theme?: string;
  style?: CSSProperties;
  iconStyle?: 'circle' | 'triangle' | 'square';
  indentWidth?: number;
  collapsed?: boolean | number;
  collapseStringsAfterLength?: boolean | number;
  groupArraysAfterLength?: number;
  enableClipboard?: boolean;
  displayObjectSize?: boolean;
  displayDataTypes?: boolean;
  defaultValue?: Record<string, any> | null;
  sortKeys?: boolean;
  validationMessage?: string;
}

export const JsonView = ({
  src = null,
  name = false,
  theme = 'rjv-default',
  style = {},
  iconStyle = 'circle',
  indentWidth = 8,
  collapsed = false,
  collapseStringsAfterLength = false,
  groupArraysAfterLength = 100,
  enableClipboard = true,
  displayObjectSize = false,
  displayDataTypes = false,
  defaultValue = null,
  sortKeys = false,
  validationMessage = 'Validation Error',
}: JsonViewProps) => {
  const resolvedName = typeof name === 'string' || name === false ? name : false;
  const resolvedCollapseStringsAfterLength =
    typeof collapseStringsAfterLength === 'number' ? collapseStringsAfterLength : false;

  return (
    <ReactJson
      src={src ?? {}}
      name={resolvedName}
      theme={theme as any}
      style={style}
      iconStyle={iconStyle}
      indentWidth={indentWidth}
      collapsed={collapsed}
      collapseStringsAfterLength={resolvedCollapseStringsAfterLength}
      groupArraysAfterLength={groupArraysAfterLength}
      enableClipboard={enableClipboard}
      displayObjectSize={displayObjectSize}
      displayDataTypes={displayDataTypes}
      defaultValue={defaultValue ?? undefined}
      sortKeys={sortKeys}
      validationMessage={validationMessage}
      onEdit={() => false}
      onAdd={() => false}
      onDelete={() => false}
    />
  );
};
