interface ParsedImage {
  width: number;
  height: number;
  bpp: number;
  buffer: ArrayBuffer;
}

declare const isICO: (source: ArrayBuffer | Buffer) => Boolean;

declare const parse: (
  buffer: ArrayBuffer | Buffer,
  mime?: string
) => Promise<Array<ParsedImage>>;

declare const ICO: { isICO, parse };

export type { ParsedImage };

export { isICO, parse };

export default ICO;
