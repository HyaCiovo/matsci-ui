import { createElement } from 'react';
import type { Preview } from '@storybook/react-vite';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import 'bulma/css/bulma.css';
import '../src/styles.less';
import '../src/stories/stories.css';
import { StorybookLocaleProvider, type StorybookLocale } from '../src/stories/i18n/LocaleProvider';

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
        locationSearch: typeof window === 'undefined' ? undefined : window.location.search,
      });
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
      }

      return createElement(
        StorybookLocaleProvider,
        { locale, key: locale },
        createElement(Story)
      );
    },
  ],
  parameters: {
    docs: {
      container: (props: DocsContainerProps) => {
        const globals = (props.context as unknown as { globals?: Record<string, unknown> }).globals;
        const locale = resolveStorybookLocale({
          globals,
          locationSearch: typeof window === 'undefined' ? undefined : window.location.search,
        });

        return createElement(
          StorybookLocaleProvider,
          { locale, key: locale },
          createElement(DocsContainer, props)
        );
      },
    },
    controls: { expanded: true, sort: 'alpha' },
    options: {
      storySort: {
        order: [
          'Introduction',
          ['matsci-ui', 'Usage with Dash'],
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
