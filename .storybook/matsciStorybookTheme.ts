import { create } from 'storybook/theming';

const matsciCodeTheme = {
  plain: {
    color: '#e6edf3',
  },
  comment: {
    color: '#8b949e',
    fontStyle: 'italic',
  },
  prolog: {
    color: '#8b949e',
  },
  doctype: {
    color: '#8b949e',
  },
  cdata: {
    color: '#8b949e',
  },
  punctuation: {
    color: '#c9d1d9',
  },
  operator: {
    color: '#ff7b72',
  },
  keyword: {
    color: '#ff7b72',
  },
  selector: {
    color: '#ff7b72',
  },
  atrule: {
    color: '#d2a8ff',
  },
  tag: {
    color: '#7ee787',
  },
  'class-name': {
    color: '#ffa657',
  },
  function: {
    color: '#d2a8ff',
  },
  method: {
    color: '#d2a8ff',
  },
  builtin: {
    color: '#ffa657',
  },
  property: {
    color: '#79c0ff',
  },
  'attr-name': {
    color: '#79c0ff',
  },
  regex: {
    color: '#7ee787',
  },
  important: {
    color: '#ffa657',
  },
  variable: {
    color: '#ffa657',
  },
  number: {
    color: '#79c0ff',
  },
  boolean: {
    color: '#79c0ff',
  },
  constant: {
    color: '#79c0ff',
  },
  symbol: {
    color: '#79c0ff',
  },
  string: {
    color: '#a5d6ff',
  },
  char: {
    color: '#a5d6ff',
  },
  'attr-value': {
    color: '#a5d6ff',
  },
  inserted: {
    color: '#7ee787',
  },
  deleted: {
    color: '#ffa198',
  },
  entity: {
    color: '#79c0ff',
    cursor: 'help',
  },
  bold: {
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
} as const;

export const matsciStorybookTheme = create(
  {
    base: 'light',
    brandTitle: 'Matsci UI',
    colorPrimary: '#3273dc',
    colorSecondary: '#2459b2',
    appBg: '#edf3fb',
    appContentBg: '#ffffff',
    appHoverBg: '#e8eff9',
    appPreviewBg: '#f7f9fc',
    appBorderColor: 'rgba(50, 115, 220, 0.16)',
    appBorderRadius: 16,
    fontBase: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontCode: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    textColor: '#162033',
    textInverseColor: '#ffffff',
    textMutedColor: '#5b6982',
    barTextColor: '#31405d',
    barHoverColor: '#15284d',
    barSelectedColor: '#3273dc',
    barBg: 'rgba(255, 255, 255, 0.94)',
    buttonBg: '#ffffff',
    buttonBorder: 'rgba(50, 115, 220, 0.18)',
    booleanBg: '#dce7fb',
    booleanSelectedBg: '#3273dc',
    inputBg: '#ffffff',
    inputBorder: 'rgba(50, 115, 220, 0.22)',
    inputTextColor: '#162033',
    inputBorderRadius: 10,
  },
  {
    code: matsciCodeTheme,
  }
) as ReturnType<typeof create> & {
  code: typeof matsciCodeTheme;
};
