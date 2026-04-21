export function mergeTexts<T extends Record<string, any>>(defaults: T, overrides?: Partial<T> | null): T {
  if (!overrides) return defaults;
  return { ...defaults, ...overrides };
}

