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

declare const ICO: {
  isICO: (source: ArrayBuffer | Buffer) => Boolean;
  parseICO: (
    buffer: ArrayBuffer | Buffer,
    mime?: string
  ) => Promise<Array<ParsedImage>>;
};

export type { ParsedImage };

export { isICO, parseICO };

export default ICO;
