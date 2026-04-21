import { type MouseEvent } from 'react';
import {
  type InputHelpItem,
  MaterialsInput,
  type MaterialsInputProps,
  type MaterialsInputType,
} from '../../../data-entry/MaterialsInput/MaterialsInput';
import { MaterialsInputType as MaterialsInputTypeEnum } from '../../../data-entry/MaterialsInput/utils';
import { useSearchUIContext } from '../SearchUIContextProvider';
import type { SearchUIAllowedInputTypesMap } from '../types';

export interface SearchUISearchBarProps
  extends Pick<
    MaterialsInputProps,
    | 'inputClassName'
    | 'periodicTableMode'
    | 'placeholder'
    | 'errorMessage'
    | 'chemicalSystemSelectHelpText'
    | 'elementsSelectHelpText'
    | 'helpItems'
    | 'hidePeriodicTable'
    | 'showTypeDropdown'
    | 'showSubmitButton'
    | 'hideWildcardButton'
    | 'label'
  > {
  className?: string;
  allowedInputTypesMap?: SearchUIAllowedInputTypesMap;
}

const DEFAULT_ALLOWED_INPUT_TYPES_MAP: SearchUIAllowedInputTypesMap = {
  [MaterialsInputTypeEnum.FORMULA]: { field: 'formula' },
  [MaterialsInputTypeEnum.ELEMENTS]: { field: 'elements' },
  [MaterialsInputTypeEnum.CHEMICAL_SYSTEM]: { field: 'chemsys' },
  [MaterialsInputTypeEnum.MPID]: { field: 'material_ids' },
  [MaterialsInputTypeEnum.TEXT]: { field: 'q' },
  [MaterialsInputTypeEnum.SMILES]: { field: 'smiles' },
  [MaterialsInputTypeEnum.MOLECULE_FORMULA]: { field: 'formula' },
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const getAllowedInputTypes = (allowedInputTypesMap: SearchUIAllowedInputTypesMap) => {
  return Object.keys(allowedInputTypesMap) as MaterialsInputType[];
};

const getAllowedFields = (allowedInputTypesMap: SearchUIAllowedInputTypesMap) => {
  return Array.from(
    new Set(
      Object.values(allowedInputTypesMap)
        .map((config) => config?.field)
        .filter((field): field is string => Boolean(field))
    )
  );
};

const hasSearchValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && value !== '';
};

const mapInputTypeToField = (
  inputType: MaterialsInputType,
  allowedInputTypesMap: SearchUIAllowedInputTypesMap
) => {
  return allowedInputTypesMap[inputType]?.field;
};

const getCurrentInputType = ({
  query,
  allowedInputTypes,
  allowedInputTypesMap,
}: {
  query: Record<string, any>;
  allowedInputTypes: MaterialsInputType[];
  allowedInputTypesMap: SearchUIAllowedInputTypesMap;
}) => {
  const explicitInputType = query._inputType as MaterialsInputType | undefined;
  if (explicitInputType && allowedInputTypes.includes(explicitInputType)) {
    return explicitInputType;
  }

  const inferredInputType = allowedInputTypes.find((inputType) => {
    const field = mapInputTypeToField(inputType, allowedInputTypesMap);
    return field ? hasSearchValue(query[field]) : false;
  });

  return inferredInputType ?? allowedInputTypes[0];
};

export const SearchUISearchBar = ({
  allowedInputTypesMap,
  className = 'is-medium',
  inputClassName,
  periodicTableMode,
  placeholder,
  errorMessage,
  chemicalSystemSelectHelpText,
  elementsSelectHelpText,
  helpItems,
  hidePeriodicTable,
  showTypeDropdown = false,
  showSubmitButton = true,
  hideWildcardButton,
  label,
}: SearchUISearchBarProps) => {
  const { autocompleteFormulaUrl, apiKey, query, submitSearch, setQuery, activeFilters, resultLabel } =
    useSearchUIContext();
  const resolvedAllowedInputTypesMap =
    allowedInputTypesMap && Object.keys(allowedInputTypesMap).length > 0
      ? allowedInputTypesMap
      : DEFAULT_ALLOWED_INPUT_TYPES_MAP;
  const allowedInputTypes = getAllowedInputTypes(resolvedAllowedInputTypesMap);
  const allowedFields = getAllowedFields(resolvedAllowedInputTypesMap);
  const currentInputType = getCurrentInputType({
    query,
    allowedInputTypes,
    allowedInputTypesMap: resolvedAllowedInputTypesMap,
  });
  const currentField = currentInputType
    ? mapInputTypeToField(currentInputType, resolvedAllowedInputTypesMap)
    : undefined;
  const shouldHidePeriodicTable = hidePeriodicTable || activeFilters.length > 0;

  const handleSubmit = async (event: React.FormEvent | MouseEvent, value?: string) => {
    const targetField = currentInputType
      ? mapInputTypeToField(currentInputType, resolvedAllowedInputTypesMap)
      : undefined;
    if (!targetField || !value) {
      return;
    }

    const nextQuery = { ...query } as Record<string, any>;

    allowedFields.forEach((field) => {
      if (field !== targetField) {
        delete nextQuery[field];
      }
    });

    nextQuery[targetField] = value;

    delete nextQuery._inputType;
    await submitSearch(nextQuery);
  };

  return (
    <MaterialsInput
      value={currentField ? query[currentField] ?? '' : ''}
      type={currentInputType}
      onChange={(value) => {
        const targetField = currentInputType
          ? mapInputTypeToField(currentInputType, resolvedAllowedInputTypesMap)
          : undefined;
        if (targetField) {
          setQuery({
            ...query,
            [targetField]: value,
          });
        }
      }}
      onInputTypeChange={(type) => {
        setQuery({ ...query, _inputType: type });
      }}
      onSubmit={handleSubmit}
      periodicTableMode={periodicTableMode}
      placeholder={placeholder}
      errorMessage={errorMessage}
      chemicalSystemSelectHelpText={chemicalSystemSelectHelpText}
      elementsSelectHelpText={elementsSelectHelpText}
      helpItems={helpItems as InputHelpItem[] | undefined}
      inputClassName={inputClassName ?? className}
      hidePeriodicTable={shouldHidePeriodicTable}
      showTypeDropdown={showTypeDropdown}
      showSubmitButton={showSubmitButton}
      hideWildcardButton={hideWildcardButton}
      label={label ?? capitalize(resultLabel)}
      autocompleteFormulaUrl={autocompleteFormulaUrl}
      autocompleteApiKey={apiKey}
      allowedInputTypes={allowedInputTypes}
    />
  );
};
