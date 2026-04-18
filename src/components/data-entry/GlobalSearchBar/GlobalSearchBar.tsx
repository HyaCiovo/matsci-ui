import { useState } from 'react';
import { MaterialsInput, MaterialsInputType, PeriodicTableMode } from '../MaterialsInput';

export interface GlobalSearchBarProps {
  redirectRoute: string;
  hidePeriodicTable?: boolean;
  autocompleteFormulaUrl?: string;
  apiKey?: string;
  placeholder?: string;
}

const navigateTo = (event: React.FormEvent | React.MouseEvent, href: string) => {
  if ('metaKey' in event && (event.metaKey || event.ctrlKey)) {
    return;
  }

  event.preventDefault();
  window.history.pushState({}, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const GlobalSearchBar = ({
  redirectRoute,
  hidePeriodicTable,
  autocompleteFormulaUrl,
  apiKey,
  placeholder,
}: GlobalSearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchInputType, setSearchInputType] = useState(MaterialsInputType.ELEMENTS);

  const handleSubmit = (event: React.FormEvent | React.MouseEvent, value?: string) => {
    const query = new URLSearchParams();
    query.set(searchInputType, value ?? searchValue);
    navigateTo(event, `${redirectRoute}?${query.toString()}`);
  };

  return (
    <MaterialsInput
      value={searchValue}
      type={searchInputType}
      onChange={(value) => setSearchValue(value)}
      onInputTypeChange={(inputType) => setSearchInputType(inputType)}
      onSubmit={handleSubmit}
      periodicTableMode={PeriodicTableMode.TOGGLE}
      hidePeriodicTable={hidePeriodicTable}
      autocompleteFormulaUrl={autocompleteFormulaUrl}
      autocompleteApiKey={apiKey}
      placeholder={placeholder}
      showSubmitButton
      showTypeDropdown
      allowedInputTypes={[
        MaterialsInputType.ELEMENTS,
        MaterialsInputType.CHEMICAL_SYSTEM,
        MaterialsInputType.FORMULA,
        MaterialsInputType.MPID,
      ]}
    />
  );
};
