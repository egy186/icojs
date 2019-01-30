export interface ParsedImage {
  width: number,
  height: number,
  bpp: number,
  buffer: ArrayBuffer
}

export function isICO(source: ArrayBuffer | Buffer): Boolean;

export function parse(buffer: ArrayBuffer | Buffer, mime?: string): Promise<Array<ParsedImage>>;

export function parseSync(buffer: ArrayBuffer | Buffer, mime?: string): Array<ParsedImage>;
