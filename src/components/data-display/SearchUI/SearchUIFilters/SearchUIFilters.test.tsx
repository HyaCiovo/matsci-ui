import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIFilters } from './SearchUIFilters';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { FilterType, type FilterGroup } from '../types';

vi.mock('../../../data-entry/MaterialsInput', () => ({
  MaterialsInputType: {
    CHEMICAL_SYSTEM: 'chemical_system',
    ELEMENTS: 'elements',
    FORMULA: 'formula',
    MPID: 'mpid',
  },
  MaterialsInput: ({ value, onChange }: { value?: string; onChange?: (value: string) => void }) => (
    <input
      data-testid="materials-input-search-input"
      value={value ?? ''}
      onChange={(event) => onChange?.(event.target.value)}
    />
  ),
}));

vi.mock('../../../data-entry/Select', () => ({
  Select: ({
    value,
    options,
    placeholder,
    onChange,
  }: {
    value?: string;
    options: { label: string; value: string }[];
    placeholder?: string;
    onChange?: (option: { label: string; value: string } | null) => void;
  }) => (
    <select
      value={value ?? ''}
      aria-label={placeholder ?? 'Select'}
      onChange={(event) => {
        const option = options.find((item) => item.value === event.target.value) ?? null;
        onChange?.(option);
      }}
    >
      <option value="">Any</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('../../../data-entry/CheckboxList', () => ({
  CheckboxList: ({
    value,
    options,
    onChange,
  }: {
    value?: string[];
    options: { label: string; value: string }[];
    onChange?: (value: string[]) => void;
  }) => {
    const current = value ?? [];
    return (
      <div>
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="checkbox"
              checked={current.includes(option.value)}
              onChange={(event) => {
                const nextValues = event.target.checked
                  ? [...current, option.value]
                  : current.filter((item) => item !== option.value);
                onChange?.(nextValues);
              }}
            />
            {option.label}
          </label>
        ))}
      </div>
    );
  },
}));

vi.mock('../../../data-entry/TextInput', () => ({
  TextInput: ({
    value,
    placeholder,
    debounceTime,
    onChange,
  }: {
    value?: string;
    placeholder?: string;
    debounceTime?: number;
    onChange?: (value: string) => void;
  }) => (
    <input
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(event) => {
        const nextValue = event.target.value;
        setTimeout(() => {
          onChange?.(nextValue);
        }, debounceTime ?? 0);
      }}
    />
  ),
}));

const filterGroups: FilterGroup[] = [
  {
    name: 'Composition',
    expanded: true,
    filters: [
      {
        name: 'Material ID',
        type: FilterType.MATERIALS_INPUT,
        params: ['material_ids'],
        props: {
          type: 'mpid',
          errorMessage: 'Please enter a valid material ID.',
        },
      },
      {
        name: 'Crystal System',
        type: FilterType.SELECT,
        params: ['crystal_system'],
        props: {
          options: [
            { label: 'Cubic', value: 'cubic' },
            { label: 'Trigonal', value: 'trigonal' },
          ],
        },
      },
      {
        name: 'Available Properties',
        type: FilterType.CHECKBOX_LIST,
        params: ['has_props'],
        props: {
          options: [
            { label: 'DOS', value: 'dos' },
            { label: 'Band Structure', value: 'bandstructure' },
          ],
        },
      },
    ],
  },
];

const QueryProbe = () => {
  const { query, activeFilters } = useSearchUIContext();
  return (
    <>
      <pre data-testid="search-ui-query">{JSON.stringify(query)}</pre>
      <div data-testid="search-ui-active-filters">{activeFilters.length}</div>
    </>
  );
};

describe('SearchUIFilters', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('updates query values through filters and resets them', async () => {
    render(
      <SearchUIContainer filterGroups={filterGroups} defaultQuery={{ _sort_fields: ['material_id'] }}>
        <SearchUIFilters />
        <QueryProbe />
      </SearchUIContainer>
    );

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'mp-149' },
    });
    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'cubic' },
    });
    fireEvent.click(screen.getByLabelText('DOS'));

    await waitFor(() => {
      expect(screen.getByTestId('search-ui-query')).toHaveTextContent('material_ids');
      expect(screen.getByTestId('search-ui-query')).toHaveTextContent('crystal_system');
      expect(screen.getByTestId('search-ui-query')).toHaveTextContent('has_props');
      expect(screen.getByTestId('search-ui-active-filters')).toHaveTextContent('3');
    });

    fireEvent.click(screen.getByTestId('search-ui-reset-button'));

    await waitFor(() => {
      expect(screen.getByTestId('search-ui-query')).toHaveTextContent('_sort_fields');
      expect(screen.getByTestId('search-ui-query')).not.toHaveTextContent('material_ids');
      expect(screen.getByTestId('search-ui-active-filters')).toHaveTextContent('0');
    });
  });

  it('uses container debounce for text filters when filter-level debounce is not provided', async () => {
    const textFilterGroups: FilterGroup[] = [
      {
        name: 'Keyword',
        expanded: true,
        filters: [
          {
            name: 'Keyword',
            type: FilterType.TEXT_INPUT,
            params: ['keyword'],
            props: {
              placeholder: 'Search keyword',
            },
          },
        ],
      },
    ];

    render(
      <SearchUIContainer filterGroups={textFilterGroups} debounce={50} defaultQuery={{ _sort_fields: ['material_id'] }}>
        <SearchUIFilters />
        <QueryProbe />
      </SearchUIContainer>
    );

    fireEvent.change(screen.getByPlaceholderText('Search keyword'), {
      target: { value: 'oxide' },
    });

    expect(screen.getByTestId('search-ui-query')).not.toHaveTextContent('keyword');

    await waitFor(() => {
      expect(screen.getByTestId('search-ui-query')).toHaveTextContent('"keyword":"oxide"');
    });
  });

  it('expands one accordion group at a time and closes sibling groups', () => {
    const accordionGroups: FilterGroup[] = [
      {
        name: 'Composition',
        expanded: true,
        filters: [
          {
            name: 'Material ID',
            type: FilterType.MATERIALS_INPUT,
            params: ['material_ids'],
            props: { type: 'mpid' },
          },
        ],
      },
      {
        name: 'Thermodynamics',
        filters: [
          {
            name: 'Crystal System',
            type: FilterType.SELECT,
            params: ['crystal_system'],
            props: {
              options: [{ label: 'Cubic', value: 'cubic' }],
            },
          },
        ],
      },
    ];

    render(
      <SearchUIContainer filterGroups={accordionGroups}>
        <SearchUIFilters />
      </SearchUIContainer>
    );

    const compositionButton = screen.getByRole('button', { name: /Composition/i });
    const thermodynamicsButton = screen.getByRole('button', { name: /Thermodynamics/i });

    expect(compositionButton).toHaveAttribute('aria-expanded', 'true');
    expect(thermodynamicsButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(thermodynamicsButton);

    expect(compositionButton).toHaveAttribute('aria-expanded', 'false');
    expect(thermodynamicsButton).toHaveAttribute('aria-expanded', 'true');
  });
});
