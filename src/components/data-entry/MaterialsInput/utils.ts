export enum MaterialsInputType {
  ELEMENTS = 'elements',
  CHEMICAL_SYSTEM = 'chemical_system',
  FORMULA = 'formula',
  MPID = 'mpid',
  SMILES = 'smiles',
  TEXT = 'text',
  MOLECULE_FORMULA = 'molecule_formula',
}

export enum PeriodicTableSelectionMode {
  ELEMENTS = 'elements',
  CHEMICAL_SYSTEM = 'chemical_system',
  FORMULA = 'formula',
}

export const VALID_ELEMENTS =
  'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar Kr K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La-Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac-Lr Rf Db Sg Bh Hs Mt Ds Rg Cn La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(
    ' '
  );

const isElement = (elementStr: string, data = VALID_ELEMENTS) => data.indexOf(elementStr) !== -1;

export const getDelimiter = (input: string): RegExp => {
  const comma = input.match(/,/);
  const hyphen = input.match(/-/);
  const space = input.match(/\s/);

  if (
    comma &&
    comma.index !== undefined &&
    (!hyphen || hyphen.index === undefined || hyphen.index > comma.index) &&
    (!space || space.index === undefined || space.index > comma.index)
  ) {
    return /,/;
  }

  if (
    hyphen &&
    hyphen.index !== undefined &&
    (!comma || comma.index === undefined || comma.index > hyphen.index) &&
    (!space || space.index === undefined || space.index > hyphen.index)
  ) {
    return /-/;
  }

  if (
    space &&
    space.index !== undefined &&
    (!comma || comma.index === undefined || comma.index > space.index) &&
    (!hyphen || hyphen.index === undefined || hyphen.index > space.index)
  ) {
    return /\s/;
  }

  return /,/;
};

export const arrayToDelimitedString = (arr: string[], delimiter: string | RegExp = ',') => {
  let delimiterValue = delimiter.toString();
  if (delimiterValue.includes('s')) {
    delimiterValue = ' ';
  } else if (delimiterValue.startsWith('/')) {
    delimiterValue = delimiterValue.replace(/\//g, '');
  }

  return arr.toString().replace(/,/g, delimiterValue);
};

export const validateElements = (elementStr: string, delimiter?: RegExp): string[] | undefined => {
  const activeDelimiter = delimiter || getDelimiter(elementStr);
  const delimiterString = activeDelimiter.toString();
  let cleanElementsStr = '';

  if (delimiterString === /,/.toString()) {
    cleanElementsStr = elementStr.replace(/and|\s|-|[0-9]/gi, '');
  } else if (delimiterString === /-/.toString()) {
    cleanElementsStr = elementStr.replace(/and|\s|[0-9]/gi, '');
  } else {
    cleanElementsStr = elementStr.replace(/and|,|-|[0-9]/gi, '');
  }

  const unparsedElements = cleanElementsStr.split(activeDelimiter);
  const parsedElements: string[] = [];
  let valid = true;

  unparsedElements.forEach((element) => {
    if (isElement(element)) {
      parsedElements.push(element);
    } else if (element !== '*' && element !== '') {
      valid = false;
    }
  });

  return valid ? parsedElements : undefined;
};

export const validateElementsList = (elementStr: string): string[] | undefined => {
  const delimiter = getDelimiter(elementStr);
  if (delimiter.toString() !== /,/.toString()) {
    return;
  }

  const validatedElements = validateElements(elementStr, delimiter);
  if (validatedElements && validatedElements.length > 5) {
    return;
  }

  return validatedElements;
};

export const validateChemicalSystem = (elementStr: string): string[] | undefined => {
  return validateElements(elementStr, /-/);
};

export const validateFormula = (
  formula: string,
  illegalCharsRegex: RegExp = /([^A-Z]|^)+[a-z]|[^\w()*.]+|\s+/,
  elementsRegex: RegExp = /([A-Z][a-z]*)([\d.]*)/g
): string[] | undefined => {
  try {
    const cleanFormula = formula.replace(/\s+$/, '');
    const illegalChars = cleanFormula.match(illegalCharsRegex);
    if (illegalChars != null) {
      return;
    }

    const elements: string[] = [];
    let match: RegExpExecArray | null = null;
    while ((match = elementsRegex.exec(cleanFormula))) {
      if (!isElement(match[1])) {
        return;
      }
      if (!elements.includes(match[1])) {
        elements.push(match[1]);
      }
    }

    return elements.length > 0 ? elements : undefined;
  } catch {
    return;
  }
};

export const validateMoleculeFormula = (
  formula: string,
  illegalCharsRegex: RegExp = /([^A-Z]|^)+[a-z]|[^\w()*.]+/g,
  elementsRegex: RegExp = /([A-Z][a-z]*)([\d.]*)/g
): string[] | undefined => {
  try {
    const cleanFormula = formula.replace(/\s/g, '');
    if (cleanFormula.match(illegalCharsRegex) != null) {
      return;
    }

    const elements: string[] = [];
    let match: RegExpExecArray | null = null;
    while ((match = elementsRegex.exec(cleanFormula))) {
      if (!isElement(match[1])) {
        return;
      }
      if (!elements.includes(match[1])) {
        elements.push(match[1]);
      }
    }

    return elements.length > 0 ? elements : undefined;
  } catch {
    return;
  }
};

export const validateSmiles = (value: string): string | null => {
  const result = value.trim().match(/^([^J][0-9BCOHNSOPrIFla@+\-[\](\)\\/%=#$]{6,})$/gi);
  return Array.isArray(result) ? value : null;
};

export const validateMPID = (value: string): string | null => {
  return value.match(/^(mp|mvc|mol)-\d+/) ? value : null;
};

export const validateInputLength = (
  parsedValue: string | string[] | undefined | null,
  type: MaterialsInputType | null,
  maxElements?: number
): boolean => {
  switch (type) {
    case MaterialsInputType.CHEMICAL_SYSTEM:
    case MaterialsInputType.ELEMENTS:
    case MaterialsInputType.FORMULA:
      return !(maxElements && parsedValue && parsedValue.length > maxElements);
    default:
      return true;
  }
};

export type MaterialsInputTypesMap = Partial<Record<MaterialsInputType, any>>;

export const materialsInputTypes: MaterialsInputTypesMap = {
  mpid: {
    validate: validateMPID,
    order: 1,
    dropdownValue: 'Material ID',
  },
  formula: {
    validate: validateFormula,
    order: 2,
    selectionMode: PeriodicTableSelectionMode.FORMULA,
    dropdownValue: 'Formula',
  },
  chemical_system: {
    validate: validateChemicalSystem,
    order: 3,
    selectionMode: PeriodicTableSelectionMode.CHEMICAL_SYSTEM,
    dropdownValue: 'Chemical System',
    elementsOnlyDropdownValue: 'Only',
  },
  elements: {
    validate: validateElementsList,
    order: 4,
    selectionMode: PeriodicTableSelectionMode.ELEMENTS,
    dropdownValue: 'Elements',
    elementsOnlyDropdownValue: 'At least',
  },
  molecule_formula: {
    validate: validateMoleculeFormula,
    order: 5,
    dropdownValue: 'Molecule Formula',
  },
  smiles: {
    validate: validateSmiles,
    order: 6,
    dropdownValue: 'SMILES',
  },
  text: {
    validate: () => true,
    order: 7,
    dropdownValue: 'Text',
  },
};

const sortInputTypes = (a: MaterialsInputType, b: MaterialsInputType) => {
  const orderA = materialsInputTypes[a]?.order ?? 0;
  const orderB = materialsInputTypes[b]?.order ?? 0;
  return orderA < orderB ? -1 : orderA > orderB ? 1 : 0;
};

export const detectAndValidateInputType = (
  value: string,
  allowedInputTypes: MaterialsInputType[]
): [MaterialsInputType | null, any] => {
  const sortedAllowedInputTypes = [...allowedInputTypes].sort(sortInputTypes);
  for (const inputType of sortedAllowedInputTypes) {
    const parsedValue = materialsInputTypes[inputType]?.validate(value);
    if (parsedValue) {
      return [inputType, parsedValue];
    }
  }
  return [null, null];
};

export const getAllowedSelectionModes = (allowedInputTypes: MaterialsInputType[]) => {
  const allowedModes: PeriodicTableSelectionMode[] = [];

  if (allowedInputTypes.includes(MaterialsInputType.CHEMICAL_SYSTEM)) {
    allowedModes.push(PeriodicTableSelectionMode.CHEMICAL_SYSTEM);
  }
  if (allowedInputTypes.includes(MaterialsInputType.ELEMENTS)) {
    allowedModes.push(PeriodicTableSelectionMode.ELEMENTS);
  }
  if (allowedInputTypes.includes(MaterialsInputType.FORMULA)) {
    allowedModes.push(PeriodicTableSelectionMode.FORMULA);
  }

  return allowedModes;
};

export const getMaterialsInputTypeByMappedValue = (key: string, value: any) => {
  for (const inputType in materialsInputTypes) {
    if (materialsInputTypes[inputType as MaterialsInputType]?.[key] === value) {
      return inputType as MaterialsInputType;
    }
  }
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const pluralize = (noun: string) => {
  const specialNouns: Record<string, string> = {
    battery: 'batteries',
    spectrum: 'spectra',
  };
  return specialNouns[noun] ?? `${noun}s`;
};
