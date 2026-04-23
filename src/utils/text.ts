export function formatTemplate(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_match, key) => {
    const value = vars[key];
    return value === undefined || value === null ? '' : String(value);
  });
}

export function mergeTexts<T extends Record<string, any>>(defaults: T, overrides?: Partial<T> | null): T {
  if (!overrides) return defaults;
  return { ...defaults, ...overrides };
}
