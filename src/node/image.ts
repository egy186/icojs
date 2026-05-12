import type { ImageConverter, ImageDataLike } from '../image.js';
import { MIME_BMP, MIME_JPEG, MIME_PNG } from '../image.js';
import { decode as decodeBmp, encode as encodeBmp } from 'bmp-ts';
import { decode as decodeJpeg, encode as encodeJpeg } from 'jpeg-js';
import { PNG } from 'pngjs';
import { fileTypeFromBuffer } from 'file-type';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, max-statements
const rgbaToAbgr = (src: Buffer): Buffer => {
  const dest = Buffer.alloc(src.length);

  for (let i = 0; i + 3 < src.length; i += 4) {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const r = src[i]!;
    const g = src[i + 1]!;
    const b = src[i + 2]!;
    const a = src[i + 3]!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    dest[i] = a;
    dest[i + 1] = b;
    dest[i + 2] = g;
    dest[i + 3] = r;
  }

  return dest;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const abgrToRgba = (src: Buffer): Buffer => {
  const dest = Buffer.alloc(src.length);

  for (let i = 0; i + 3 < src.length; i += 4) {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const b = src[i + 1]!;
    const g = src[i + 2]!;
    const r = src[i + 3]!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    dest[i] = r;
    dest[i + 1] = g;
    dest[i + 2] = b;
    // Alpha is fixed
    dest[i + 3] = 0xFF;
  }

  return dest;
};

interface BufferImageDataLike {
  readonly data: Buffer;
  readonly width: number;
  readonly height: number;
}

interface ImageDecoders {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  readonly [mime: string]: (buffer: Buffer) => ImageDataLike;
}

const decoders = {
  /* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
  [MIME_BMP]: (buffer: Buffer) => {
    const bmpImageData = decodeBmp(buffer);

    return {
      data: abgrToRgba(bmpImageData.data),
      height: bmpImageData.height,
      width: bmpImageData.width
    };
  },
  [MIME_JPEG]: (buffer: Buffer) => decodeJpeg(buffer),
  [MIME_PNG]: (buffer: Buffer) => PNG.sync.read(buffer)
  /* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */
} as const satisfies ImageDecoders;

interface ImageEncoders {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  readonly [mime: string]: (imageData: BufferImageDataLike) => Buffer;
}

const encoders = {
  /* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
  [MIME_BMP]: (imageData: BufferImageDataLike) => {
    const bmpImageData = {
      ...imageData,
      data: rgbaToAbgr(imageData.data)
    };

    return encodeBmp(bmpImageData).data;
  },
  [MIME_JPEG]: (imageData: BufferImageDataLike) => encodeJpeg(imageData).data,
  [MIME_PNG]: (imageData: BufferImageDataLike) => {
    const png = new PNG({
      height: imageData.height,
      width: imageData.width
    });

    png.data = imageData.data;
    return PNG.sync.write(png);
  }
  /* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */
} as const satisfies ImageEncoders;

const isKeyOf = <T extends object>(obj: T, key: PropertyKey): key is keyof T => key in obj;

const imageConverter = {
  /**
   * Create ImageData from an image buffer.
   *
   * @param arrayBuffer - Image buffer to decode.
   * @returns Decoded image data.
   * @private
   */
  async decode (arrayBuffer: Readonly<ArrayBuffer>): Promise<ImageDataLike> {
    const buffer = Buffer.from(arrayBuffer);
    const { mime } = await fileTypeFromBuffer(buffer) ?? {};
    if (mime === undefined || !isKeyOf(decoders, mime)) {
      throw new TypeError(`${mime} is not supported`);
    }
    const decoder = decoders[mime];
    const { data, height, width } = decoder(buffer);
    return {
      data: new Uint8ClampedArray(data),
      height,
      width
    };
  },

  /**
   * Create an image buffer from ImageData.
   *
   * @param image - Image data to encode.
   * @param mime - Output MIME type.
   * @returns Encoded image buffer.
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/require-await
  async encode (image: ImageDataLike, mime: string = MIME_PNG): Promise<ArrayBuffer> {
    const imageData = {
      data: Buffer.from(image.data),
      height: image.height,
      width: image.width
    };
    const encoder = isKeyOf(encoders, mime) ? encoders[mime] : encoders[MIME_PNG];
    const imageBuffer = encoder(imageData);
    const arrayBuffer = new Uint8Array(imageBuffer).buffer;
    return arrayBuffer;
  }
} as const satisfies ImageConverter;

export { imageConverter };

export default imageConverter;
