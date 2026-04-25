import { createElement } from 'react';
import type { Preview } from '@storybook/react-vite';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { ShikiDocsCode } from './ShikiDocsCode';
import { matsciStorybookTheme } from './matsciStorybookTheme';
import '../src/themes/foundation/tokens.css';
import '../src/themes/foundation/matsci-bulma.css';
import '../src/themes/shared/components-data-display.css';
import '../src/themes/shared/components-data-entry.css';
import '../src/themes/shared/components-navigation.css';
import '../src/themes/shared/components-periodic-table.css';
import '../src/themes/shared/components-periodic-table.less';
import '../src/themes/shared/components-publications.css';
import '../src/themes/shared/components-crystal.less';
import './themes/gnosys-preview-tokens.css';
import './themes/gnosys-preview-overrides.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import '../src/stories/stories.css';
import './storybook-docs.css';
import { StorybookLocaleProvider, type StorybookLocale } from '../src/stories/i18n/LocaleProvider';

type StorybookThemeName = 'bulma' | 'gnosys';
type ScalarControlType = 'boolean' | 'number' | 'text';
type StorybookScalarLikeType = {
  name?: string;
  value?: Array<{ name?: string }> | unknown;
};

const OPTIONAL_TYPE_NAMES = new Set(['undefined', 'null']);
const BOOLEAN_TYPE_NAMES = new Set(['boolean', 'true', 'false']);
const NUMBER_TYPE_NAMES = new Set(['number']);
const STRING_TYPE_NAMES = new Set(['string']);
const STORYBOOK_THEME_ALIASES: Record<string, StorybookThemeName> = {
  bulma: 'bulma',
  gnosys: 'gnosys',
  default: 'bulma',
  tech: 'gnosys',
};

function inferScalarControlTypeFromNames(names: string[]): ScalarControlType | undefined {
  const filtered = names.filter((name) => !OPTIONAL_TYPE_NAMES.has(name));
  if (filtered.length === 0) return undefined;

  if (filtered.every((name) => BOOLEAN_TYPE_NAMES.has(name))) return 'boolean';
  if (filtered.every((name) => NUMBER_TYPE_NAMES.has(name))) return 'number';
  if (filtered.every((name) => STRING_TYPE_NAMES.has(name))) return 'text';

  return undefined;
}

function inferScalarControlType(argType: {
  type?: StorybookScalarLikeType;
  table?: { type?: { summary?: string } };
}): ScalarControlType | undefined {
  const sbType = argType.type;
  const sbTypeName = sbType?.name?.toLowerCase();

  if (sbTypeName === 'boolean') return 'boolean';
  if (sbTypeName === 'number') return 'number';
  if (sbTypeName === 'string') return 'text';

  if (sbTypeName === 'union' && Array.isArray(sbType?.value)) {
    const unionNames = sbType.value
      .map((item) => item?.name?.toLowerCase())
      .filter((value): value is string => Boolean(value));
    const inferredFromUnion = inferScalarControlTypeFromNames(unionNames);
    if (inferredFromUnion) return inferredFromUnion;
  }

  const summary = argType.table?.type?.summary?.toLowerCase().trim();
  if (!summary) return undefined;

  const summaryNames = summary
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean);

  return inferScalarControlTypeFromNames(summaryNames);
}

const normalizeOptionalScalarControls: NonNullable<Preview['argTypesEnhancers']>[number] = (context) => {
  const nextArgTypes = { ...context.argTypes };

  for (const [key, inputType] of Object.entries(context.argTypes ?? {})) {
    if (!inputType || inputType.control === false || inputType.options || 'mapping' in inputType) {
      continue;
    }

    const controlType = inferScalarControlType(inputType);
    if (!controlType) continue;

    nextArgTypes[key] = {
      ...inputType,
      control: {
        ...(typeof inputType.control === 'object' && inputType.control ? inputType.control : {}),
        type: controlType,
      },
    };
  }

  return nextArgTypes;
};

normalizeOptionalScalarControls.secondPass = true;

function getStorybookLocationSearch() {
  if (typeof window === 'undefined') return undefined;

  try {
    const parentSearch = window.parent?.location?.search;
    if (typeof parentSearch === 'string' && parentSearch.length > 0) {
      return parentSearch;
    }
  } catch {
    // Fall back to the iframe location if parent access is not available.
  }

  return window.location.search;
}

function resolveStorybookLocale({
  globals,
  locationSearch,
}: {
  globals?: Record<string, unknown>;
  locationSearch?: string;
}): StorybookLocale {
  if (typeof locationSearch === 'string') {
    const globalsParam = new URLSearchParams(locationSearch).get('globals') ?? '';
    for (const item of globalsParam.split(';')) {
      const [k, v] = item.split(':');
      if ((k === 'sbLocale' || k === 'locale') && (v === 'en' || v === 'zh')) return v;
    }
  }

  const fromGlobals = globals?.sbLocale ?? globals?.locale;
  if (fromGlobals === 'en' || fromGlobals === 'zh') return fromGlobals;

  return 'en';
}

function resolveStorybookTheme({
  globals,
  locationSearch,
}: {
  globals?: Record<string, unknown>;
  locationSearch?: string;
}): StorybookThemeName {
  if (typeof locationSearch === 'string') {
    const globalsParam = new URLSearchParams(locationSearch).get('globals') ?? '';
    for (const item of globalsParam.split(';')) {
      const [k, v] = item.split(':');
      if ((k === 'sbTheme' || k === 'theme') && typeof v === 'string' && v in STORYBOOK_THEME_ALIASES) {
        return STORYBOOK_THEME_ALIASES[v];
      }
    }
  }

  const fromGlobals = globals?.sbTheme ?? globals?.theme;
  if (typeof fromGlobals === 'string' && fromGlobals in STORYBOOK_THEME_ALIASES) {
    return STORYBOOK_THEME_ALIASES[fromGlobals];
  }

  return 'bulma';
}

function applyStorybookTheme(theme: StorybookThemeName) {
  if (typeof document === 'undefined') return;

  const targets = [document.documentElement, document.body];
  for (const target of targets) {
    target.dataset.msTheme = theme;
    target.classList.remove('ms-theme-default', 'ms-theme-tech', 'ms-theme-bulma', 'ms-theme-gnosys');
    target.classList.add(`ms-theme-${theme}`);
  }
}

const preview: Preview = {
  argTypesEnhancers: [normalizeOptionalScalarControls],
  globalTypes: {
    sbLocale: {
      name: 'Language',
      description: 'Storybook language',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'zh', title: '中文' },
        ],
        dynamicTitle: true,
      },
    },
    sbTheme: {
      name: 'Theme',
      description: 'Storybook theme preset',
      defaultValue: 'bulma',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'bulma', title: 'Bulma' },
          { value: 'gnosys', title: 'Gnosys' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const globals = context.globals as Record<string, unknown>;
      const locale = resolveStorybookLocale({
        globals,
        locationSearch: getStorybookLocationSearch(),
      });
      const theme = resolveStorybookTheme({
        globals,
        locationSearch: getStorybookLocationSearch(),
      });
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
        applyStorybookTheme(theme);
      }

      return createElement(
        StorybookLocaleProvider,
        { locale, key: `${locale}-${theme}` },
        createElement(
          'div',
          { className: `ms-theme ms-theme-${theme}`, 'data-ms-theme': theme },
          createElement(Story)
        )
      );
    },
  ],
  parameters: {
    docs: {
      theme: matsciStorybookTheme,
      components: {
        code: ShikiDocsCode,
      },
      container: (props: DocsContainerProps) => {
        const globals = (props.context as unknown as { globals?: Record<string, unknown> }).globals;
        const locale = resolveStorybookLocale({
          globals,
          locationSearch: getStorybookLocationSearch(),
        });
        const theme = resolveStorybookTheme({
          globals,
          locationSearch: getStorybookLocationSearch(),
        });
        applyStorybookTheme(theme);

        return createElement(
          StorybookLocaleProvider,
          { locale, key: `${locale}-${theme}` },
          createElement(
            'div',
            { className: `ms-theme ms-theme-${theme}`, 'data-ms-theme': theme },
            createElement(DocsContainer, { ...props, theme: matsciStorybookTheme })
          )
        );
      },
    },
    controls: { expanded: true, sort: 'alpha' },
    options: {
      storySort: {
        order: [
          'Introduction',
          ['MatsciUI', 'Usage with Dash'],
          'Search UI',
          [
            'Building a Search UI',
            'SearchUIContainer',
            ['Fully Featured', 'With MP Contribs Data', 'Matscholar Alpha'],
            'SearchUISearchBar',
            'SearchUIFilters',
            'SearchUIDataHeader',
            'SearchUIDataTable',
            'SearchUIDataView',
            'SearchUIGrid',
            'Columns',
            'Filters',
            'Conditional Row Styles',
            'Search Bar Input Types',
          ],
          'Data-Entry',
          [
            'MaterialsInput',
            'PeriodicTable',
            'RangeSlider',
            'DualRangeSlider',
            'Select',
            'ThreeStateBooleanSelect',
            'Switch',
          ],
          'Data-Display',
          'Publications',
          ['BibCard', 'CrossrefCard', 'BibjsonCard', 'PublicationCard', 'BibtexCard', 'BibFilter'],
          'Crystal Toolkit',
          ['CrystalToolkitScene', 'ReactGraphComponent'],
          'Navigation',
        ],
      },
    },
  },
};

export default preview;
