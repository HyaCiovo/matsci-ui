export const isUrl = (value?: string) => Boolean(value && /^(https?:)?\/\//.test(value));
