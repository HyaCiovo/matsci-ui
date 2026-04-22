import type { Meta, StoryObj } from '@storybook/react';
import { DataBlock } from '../../components/data-display/DataBlock';
import { Column } from '../../components/data-display/SearchUI/types';

const meta = {
  component: DataBlock,
  title: 'Data-Display/DataBlock'
} satisfies Meta<typeof DataBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    disableRichColumnHeaders: true,
    className: 'box',
    data: {
      material_id: 'mp-19395',
      formula_pretty: 'MnO2',
      volume: 143.9321176
    },
    columns: [
      {
        title: 'Material ID',
        selector: 'material_id',
        formatType: 'LINK',
        formatOptions: {
          baseUrl: 'https://next-gen.materialsproject.org',
          target: '_blank'
        },
        minWidth: '300px',
        maxWidth: '300px'
      },
      {
        title: 'Formula',
        selector: 'formula_pretty',
        formatType: 'FORMULA',
        minWidth: '300px',
        maxWidth: '300px'
      },
      {
        title: 'Volume',
        selector: 'volume',
        formatType: 'FIXED_DECIMAL',
        formatOptions: {
          decimals: 2
        }
      }
    ] as Column[]
  }
};

export const WithBottomSection: Story = {
  args: {
    ...Basic.args,
    data: {
      material_id: 'mp-19395',
      formula_pretty: 'MnO2',
      volume: 143.9321176,
      density: 4.012746729,
      crystal_system: 'Tetragonal',
      description: 'Ab-initio electronic transport database for inorganic materials'
    },
    columns: [
      {
        title: 'Material ID',
        selector: 'material_id',
        formatType: 'LINK',
        formatOptions: {
          baseUrl: 'https://next-gen.materialsproject.org',
          target: '_blank'
        },
        minWidth: '300px',
        maxWidth: '300px'
      },
      {
        title: 'Formula',
        selector: 'formula_pretty',
        formatType: 'FORMULA',
        minWidth: '300px',
        maxWidth: '300px'
      },
      {
        title: 'Volume',
        selector: 'volume',
        formatType: 'FIXED_DECIMAL',
        formatOptions: {
          decimals: 2
        }
      },
      {
        title: 'Density',
        selector: 'density',
        isBottom: true,
        formatType: 'FIXED_DECIMAL',
        formatOptions: {
          decimals: 2
        }
      },
      {
        title: 'Crystal System',
        selector: 'crystal_system',
        isBottom: true
      },
      {
        title: 'Description',
        selector: 'description',
        isBottom: true
      }
    ] as Column[]
  }
};

export const WithFooter: Story = {
  args: {
    ...Basic.args,
    data: {
      material_id: 'mp-19395',
      formula_pretty: 'MnO2',
      volume: 143.9321176,
      density: 4.012746729,
      crystal_system: 'Tetragonal',
      description: 'Ab-initio electronic transport database for inorganic materials'
    },
    columns: [
      {
        title: 'Material ID',
        selector: 'material_id',
        formatType: 'LINK',
        formatOptions: {
          baseUrl: 'https://next-gen.materialsproject.org',
          target: '_blank'
        },
        minWidth: '300px',
        maxWidth: '300px'
      },
      {
        title: 'Formula',
        selector: 'formula_pretty',
        formatType: 'FORMULA',
        minWidth: '300px',
        maxWidth: '300px'
      },
      {
        title: 'Volume',
        selector: 'volume',
        formatType: 'FIXED_DECIMAL',
        formatOptions: {
          decimals: 2
        }
      },
      {
        title: 'Density',
        selector: 'density',
        isBottom: true,
        formatType: 'FIXED_DECIMAL',
        formatOptions: {
          decimals: 2
        }
      },
      {
        title: 'Crystal System',
        selector: 'crystal_system',
        isBottom: true
      },
      {
        title: 'Description',
        selector: 'description',
        isBottom: true
      }
    ] as Column[],
    footer: 'Footer content'
  }
};

export const WithIcon: Story = {
  args: {
    ...Basic.args,
    iconClassName: 'square',
    iconTooltip: 'Square'
  }
};

export const WithArrayItems: Story = {
  args: {
    ...Basic.args,
    data: {
      formula_pretty: 'MnO2',
      volume: 143.9321176,
      tables: ['AA', 'BB', 'CC', 'DD', 'EE'],
      tablesTooltips: ['Table AA', 'Table BB', 'Table CC', 'Table DD', 'Table EE']
    },
    columns: [
      {
        title: 'Formula',
        selector: 'formula_pretty',
        formatType: 'FORMULA',
        minWidth: '300px',
        maxWidth: '300px'
      },
      {
        title: 'Tables',
        selector: 'tables',
        formatType: 'ARRAY',
        formatOptions: {
          arrayTooltipsKey: 'tablesTooltips'
        }
      }
    ] as Column[]
  }
};

export const WithArrayDownloadLinks: Story = {
  args: {
    ...Basic.args,
    data: {
      formula_pretty: 'MnO2',
      volume: 143.9321176,
      tables: ['AA', 'BB', 'CC', 'DD', 'EE'],
      tablesTooltips: ['Table AA', 'Table BB', 'Table CC', 'Table DD', 'Table EE'],
      tablesLinks: [
        'https://github.com',
        'https://github.com',
        'https://github.com',
        'https://github.com',
        'https://github.com'
      ]
    },
    columns: [
      {
        title: 'Formula',
        selector: 'formula_pretty',
        formatType: 'FORMULA',
        minWidth: '300px',
        maxWidth: '300px'
      },
      {
        title: 'Tables',
        selector: 'tables',
        formatType: 'ARRAY',
        formatOptions: {
          arrayTooltipsKey: 'tablesTooltips',
          arrayLinksKey: 'tablesLinks',
          arrayLinksShowDownload: true
        }
      }
    ] as Column[]
  }
};