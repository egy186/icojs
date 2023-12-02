interface ParsedImage {
  width: number;
  height: number;
  bpp: number;
  buffer: ArrayBuffer;
}

declare const isICO: (source: ArrayBuffer | Buffer) => Boolean;

declare const parseICO: (
  buffer: ArrayBuffer | Buffer,
  mime?: string
) => Promise<Array<ParsedImage>>;

declare const ICO: { isICO, parseICO };

export type { ParsedImage };

export { isICO, parseICO };

export default ICO;
