import { useEffect } from 'react';

interface DataInput {
  filename: string;
  content: any;
  isBase64?: boolean;
  isDataURL?: boolean;
  mimeType?: string;
}

export interface DownloadProps {
  id: string;
  data?: DataInput;
  isBase64?: boolean;
  isDataURL?: boolean;
  mimeType?: string;
  setProps?: (value: any) => any;
}

const decodeBase64 = (value: string) => {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

export const Download = ({
  mimeType = 'text/plain',
  isBase64 = false,
  data,
  isDataURL,
}: DownloadProps) => {
  useEffect(() => {
    if (!data) {
      return;
    }

    const resolvedMimeType = data.mimeType ?? mimeType;
    const resolvedIsDataURL = data.isDataURL ?? isDataURL;
    const resolvedIsBase64 = data.isBase64 ?? isBase64;
    let content = data.content;

    if (resolvedIsDataURL && typeof data.content === 'string') {
      content = decodeBase64(data.content.split(',')[1]);
    } else if (resolvedIsBase64 && typeof data.content === 'string') {
      content = decodeBase64(data.content);
    }

    const blob = new Blob([content], { type: resolvedMimeType });
    const link = document.createElement('a');
    document.body.appendChild(link);
    const objectUrl = window.URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = data.filename;
    link.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(link);
    }, 0);
  }, [data, isBase64, isDataURL, mimeType]);

  return null;
};
