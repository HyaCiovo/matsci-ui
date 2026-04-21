import React from 'react';
import type { StoryFn } from '@storybook/react';
import columns from '../constants/columns.json';
import filterGroups from '../constants/filterGroups.json';
import matscholarFilterGroups from '../constants/matscholarFilterGroups.json';
import mofColumns from '../constants/mofColumns.json';
import mofFilterGroups from '../constants/mofFilterGroups.json';
import { STORYBOOK_API_KEY } from '../constants';
import {
  Column,
  FilterGroup,
  SearchUIContainerProps
} from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import { SearchUISearchBar } from '../../components/data-display/SearchUI/SearchUISearchBar';
import { SearchUIGrid } from '../../components/data-display/SearchUI/SearchUIGrid';
import { MatscholarSearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer/MatscholarSearchUIContainer';

export default {
  component: SearchUIContainer,
  title: 'Search UI/SearchUIContainer'
};

export const FullyFeatured: StoryFn<SearchUIContainerProps> = (args) => (
  <SearchUIContainer
    disableRichColumnHeaders
    resultLabel="material"
    columns={columns as Column[]}
    filterGroups={filterGroups as FilterGroup[]}
    apiEndpoint="/mp-api/summary/"
    autocompleteFormulaUrl="/mp-api/materials/formula_autocomplete/"
    apiKey={STORYBOOK_API_KEY}
  >
    <SearchUISearchBar
      periodicTableMode={'toggle' as PeriodicTableMode}
      placeholder="Search by elements, formula, or ID"
      errorMessage="Invalid search value"
      allowedInputTypesMap={{
        elements: {
          field: 'elements'
        },
        formula: {
          field: 'formula'
        },
        mpid: {
          field: 'material_ids'
        }
      }}
      helpItems={[
        {
          label: 'Search Examples'
        },
        {
          label: 'Include at least elements',
          examples: ['Li,Fe', 'Si,O,K']
        },
        {
          label: 'Has exact formula',
          examples: ['Li3Fe', 'Eu2SiCl2O3']
        },
        {
          label: 'Has Material ID',
          examples: ['mp-149', 'mp-19326']
        }
      ]}
    />
    <SearchUIGrid />
  </SearchUIContainer>
);

export const WithMPContribsData: StoryFn<SearchUIContainerProps> = (args) => (
  <SearchUIContainer
    disableRichColumnHeaders
    resultLabel="contribution"
    columns={mofColumns as Column[]}
    filterGroups={mofFilterGroups as FilterGroup[]}
    apiEndpoint="/mp-contribs-api/contributions/"
    apiKey={STORYBOOK_API_KEY}
    apiEndpointParams={{ project: 'qmof' }}
    sortKey="_sort"
    totalKey="total_count"
    limitKey="_limit"
    skipKey="_skip"
    fieldsKey="_fields"
    sortFields={['data.natoms.value']}
  >
    <SearchUISearchBar
      periodicTableMode={'toggle' as PeriodicTableMode}
      placeholder="Search by elements, formula, or ID"
      errorMessage="Invalid search value"
      allowedInputTypesMap={{
        elements: {
          field: 'elements'
        },
        formula: {
          field: 'formula'
        },
        mpid: {
          field: 'material_ids'
        }
      }}
      helpItems={[
        {
          label: 'Search Examples'
        },
        {
          label: 'Include at least elements',
          examples: ['Li,Fe', 'Si,O,K']
        },
        {
          label: 'Has exact formula',
          examples: ['Li3Fe', 'Eu2SiCl2O3']
        },
        {
          label: 'Has Material ID',
          examples: ['mp-149', 'mp-19326']
        }
      ]}
    />
    <SearchUIGrid />
  </SearchUIContainer>
);

export const MatscholarAlpha: StoryFn<SearchUIContainerProps> = (args) => (
  <MatscholarSearchUIContainer
    disableRichColumnHeaders
    resultLabel="material"
    columns={columns as Column[]}
    filterGroups={matscholarFilterGroups as FilterGroup[]}
    apiEndpoint="/mp-api/summary/"
    autocompleteFormulaUrl="/mp-api/materials/formula_autocomplete/"
    apiKey={STORYBOOK_API_KEY}
    matscholarEndpoint="/matscholar-api/api/search/materials/"
  >
    <p className="has-text-centered">
      Alpha version of Matscholar search integration with Materials Explorer
    </p>
    <SearchUISearchBar
      periodicTableMode={'toggle' as PeriodicTableMode}
      placeholder="Search by elements, formula, or ID"
      errorMessage="Invalid search value"
      allowedInputTypesMap={{
        elements: {
          field: 'elements'
        },
        formula: {
          field: 'formula'
        },
        mpid: {
          field: 'material_ids'
        },
        text: {
          field: 'q'
        }
      }}
      helpItems={[
        {
          label: 'Search Examples'
        },
        {
          label: 'Include at least elements',
          examples: ['Li,Fe', 'Si,O,K']
        },
        {
          label: 'Has exact formula',
          examples: ['Li3Fe', 'Eu2SiCl2O3']
        },
        {
          label: 'Has Material ID',
          examples: ['mp-149', 'mp-19326']
        }
      ]}
    />
    <SearchUIGrid />
  </MatscholarSearchUIContainer>
);

const MatscholarAlphaDescription = `
  This is a proof of concept to demonstrate incorporating the Matscholar material search 
  functionality into the Materials Explorer search interface. Free text searches made in 
  the search bar will be routed through the Matscholar API to find matching materials. 
  Note that this is a proof of concept only and does not demonstrate complete integration 
  between the two APIs. Advanced filtering and alternative sorting are not supported with 
  Matscholar queries at this time.
`;

MatscholarAlpha.parameters = {
  docs: {
    storyDescription: MatscholarAlphaDescription
  }
};
