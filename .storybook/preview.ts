import { createElement } from 'react';
import type { Preview } from '@storybook/react-vite';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { ShikiDocsCode } from './ShikiDocsCode';
import { matsciStorybookTheme } from './matsciStorybookTheme';
import '../src/themes/entries/default.ts';
import '../src/stories/stories.css';
import './storybook-docs.css';
import { StorybookLocaleProvider, type StorybookLocale } from '../src/stories/i18n/LocaleProvider';

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

const preview: Preview = {
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
  },
  decorators: [
    (Story, context) => {
      const globals = context.globals as Record<string, unknown>;
      const locale = resolveStorybookLocale({
        globals,
        locationSearch: getStorybookLocationSearch(),
      });
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
      }

      return createElement(
        StorybookLocaleProvider,
        { locale, key: locale, children: createElement(Story) },
        createElement(Story)
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

        return createElement(
          StorybookLocaleProvider,
          {
            locale,
            key: locale,
            children: createElement(DocsContainer, { ...props, theme: matsciStorybookTheme }),
          },
          createElement(DocsContainer, { ...props, theme: matsciStorybookTheme })
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
