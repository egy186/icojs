const MIME_BMP = 'image/bmp';
const MIME_JPEG = 'image/jpeg';
const MIME_PNG = 'image/png';

interface ImageData {
  readonly data: Uint8ClampedArray | Uint8Array;
  readonly width: number;
  readonly height: number;
}

interface ImageConverter {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  readonly decode: (data: ArrayBuffer) => Promise<ImageData>;
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  readonly encode: (image: ImageData, mime: string) => Promise<ArrayBuffer>;
}

export type { ImageConverter, ImageData };

export { MIME_BMP, MIME_JPEG, MIME_PNG };
