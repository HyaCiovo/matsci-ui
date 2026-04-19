export interface TableFilterOption {
  name: string | number;
  key?: 'category' | 'phase' | 'group' | 'period';
  subGroups: TableFilterOption[];
}

export const FILTER_VALUE_MAPPER: Record<string, string> = {
  Gases: 'Gas',
  Liquids: 'Liquid',
  Solids: 'Solid',
  Unknown: 'unknown',
  Alkali: 'element-alkali-metal',
  'Alkali Earth Metals': 'element-alkali-earth-metal',
  Actinides: 'element-actinoid',
  Metalloids: 'element-metalloid',
  'Transition Metals': 'element-transition-metal',
  'Post-Transition Metals': 'element-metal',
  Lanthanides: 'element-lanthoid',
  'Noble Gases': 'element-noble-gas',
  Halogens: 'element-halogen',
  Nonmetals: 'element-non-metal',
};

export const FILTERS = {
  categories: [
    [{ name: 'All', subGroups: [] }],
    [
      {
        name: 'Metals',
        key: 'category',
        subGroups: [
          { name: 'Alkali', subGroups: [] },
          { name: 'Alkali Earth Metals', subGroups: [] },
          { name: 'Transition Metals', subGroups: [] },
          { name: 'Post-Transition Metals', subGroups: [] },
          { name: 'Metalloids', subGroups: [] },
          { name: 'Lanthanides', subGroups: [] },
          { name: 'Actinides', subGroups: [] },
        ],
      },
      {
        name: 'Nonmetals',
        key: 'category',
        subGroups: [
          { name: 'Nonmetals', subGroups: [] },
          { name: 'Halogens', subGroups: [] },
          { name: 'Noble Gases', subGroups: [] },
        ],
      },
    ],
    [
      {
        name: 'Phase',
        key: 'phase',
        subGroups: [
          { name: 'Gases', subGroups: [] },
          { name: 'Liquids', subGroups: [] },
          { name: 'Solids', subGroups: [] },
        ],
      },
    ],
    [
      {
        name: 'Groups',
        key: 'group',
        subGroups: Array.from({ length: 18 }, (_, index) => ({ name: index + 1, subGroups: [] })),
      },
      {
        name: 'Periods',
        key: 'period',
        subGroups: Array.from({ length: 7 }, (_, index) => ({ name: index + 1, subGroups: [] })),
      },
    ],
  ] satisfies TableFilterOption[][],
};

export const FILTER_BY_CATEGORY = FILTERS.categories.reduce<Record<string, TableFilterOption[]>>((accumulator, filters) => {
  filters.forEach((filter) => {
    accumulator[String(filter.name)] = filter.subGroups;
  });
  return accumulator;
}, {});
