export type DownloadType = 'json' | 'csv';

export const convertArrayOfObjectsToCSV = (rows: Record<string, unknown>[]): string | null => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  const keys = Object.keys(rows[0]);
  const lines = rows.map((row) => keys.map((key) => String(row[key] ?? '')).join(','));
  return [keys.join(','), ...lines].join('\n');
};

export const createDownloadLink = (href: string, filename: string) => {
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const href = URL.createObjectURL(blob);
  createDownloadLink(href, filename);
  window.setTimeout(() => URL.revokeObjectURL(href), 0);
  return true;
};

export const downloadJSON = (data: unknown, filename = 'export') => {
  if (data === undefined || data === null) {
    return false;
  }

  createDownloadLink(
    `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`,
    `${filename}.json`
  );
  return true;
};

export const downloadCSV = (data: Record<string, unknown>[], filename = 'export') => {
  const csv = convertArrayOfObjectsToCSV(data);
  if (!csv) {
    return false;
  }

  createDownloadLink(`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`, `${filename}.csv`);
  return true;
};

export const downloadAs: Record<DownloadType, (data: any, filename?: string) => boolean> = {
  json: downloadJSON,
  csv: downloadCSV,
};
