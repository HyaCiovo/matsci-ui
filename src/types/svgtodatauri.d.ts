declare module 'svgtodatauri' {
  export interface SvgToDataUriOptions {
    callback?: (dataUri: string) => void;
    scale?: number;
    height?: number;
    width?: number;
  }

  export default function toDataUrl(
    svgElement: Element,
    mimeType: string,
    options: SvgToDataUriOptions
  ): string | void;
}
