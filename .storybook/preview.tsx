import type { Preview } from '@storybook/react';
import React from 'react';
import 'bulma/css/bulma.css';
import '../src/styles.less';
import '../src/stories/stories.css';
import { StorybookLocaleProvider, type StorybookLocale } from '../src/stories/i18n/LocaleProvider';

const preview: Preview = {
  globalTypes: {
    locale: {
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
      const locale = (context.globals.locale ?? 'en') as StorybookLocale;
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
      }
      return (
        <StorybookLocaleProvider locale={locale}>
          <Story />
        </StorybookLocaleProvider>
      );
    },
  ],
  parameters: {
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

