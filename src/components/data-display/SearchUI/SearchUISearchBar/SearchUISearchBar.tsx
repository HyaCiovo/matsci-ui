import { type MouseEvent } from 'react';
import {
  type InputHelpItem,
  MaterialsInput,
  type MaterialsInputProps,
  type MaterialsInputType,
} from '../../../data-entry/MaterialsInput/MaterialsInput';
import { useSearchUIContext } from '../SearchUIContextProvider';
import type { SearchUIAllowedInputTypesMap } from '../types';

export interface SearchUISearchBarProps
  extends Pick<
    MaterialsInputProps,
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
  allowedInputTypesMap: SearchUIAllowedInputTypesMap;
}

const getAllowedInputTypes = (allowedInputTypesMap: SearchUIAllowedInputTypesMap) => {
  return Object.keys(allowedInputTypesMap) as MaterialsInputType[];
};

const mapInputTypeToField = (
  inputType: MaterialsInputType,
  allowedInputTypesMap: SearchUIAllowedInputTypesMap
) => {
  return allowedInputTypesMap[inputType]?.field;
};

export const SearchUISearchBar = ({
  allowedInputTypesMap,
  periodicTableMode,
  placeholder,
  errorMessage,
  chemicalSystemSelectHelpText,
  elementsSelectHelpText,
  helpItems,
  hidePeriodicTable,
  showTypeDropdown = true,
  showSubmitButton = true,
  hideWildcardButton,
  label,
}: SearchUISearchBarProps) => {
  const { autocompleteFormulaUrl, apiKey, query, submitSearch, setQuery } = useSearchUIContext();
  const allowedInputTypes = getAllowedInputTypes(allowedInputTypesMap);
  const currentInputType = (query._inputType as MaterialsInputType) ?? allowedInputTypes[0];
  const currentField = currentInputType
    ? mapInputTypeToField(currentInputType, allowedInputTypesMap)
    : undefined;

  const handleSubmit = async (event: React.FormEvent | MouseEvent, value?: string) => {
    const targetField = currentInputType
      ? mapInputTypeToField(currentInputType, allowedInputTypesMap)
      : undefined;
    if (!targetField || !value) {
      return;
    }

    const nextQuery = {
      ...query,
      [targetField]: value,
    };

    delete nextQuery._inputType;
    await submitSearch(nextQuery);
  };

  return (
    <MaterialsInput
      value={currentField ? query[currentField] ?? '' : ''}
      type={currentInputType}
      onChange={(value) => {
        const targetField = currentInputType
          ? mapInputTypeToField(currentInputType, allowedInputTypesMap)
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
      hidePeriodicTable={hidePeriodicTable}
      showTypeDropdown={showTypeDropdown}
      showSubmitButton={showSubmitButton}
      hideWildcardButton={hideWildcardButton}
      label={label}
      autocompleteFormulaUrl={autocompleteFormulaUrl}
      autocompleteApiKey={apiKey}
      allowedInputTypes={allowedInputTypes}
    />
  );
};
