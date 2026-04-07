import type { ImageConverter, ImageData } from '../image.js';
import { MIME_BMP, MIME_JPEG, MIME_PNG } from '../mime.js';
import { PNG } from 'pngjs';
import bmp from '@jimp/bmp';
import { fileTypeFromBuffer } from 'file-type';
import jpeg from 'jpeg-js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Jimp = bmp.default();

interface ImageDataLike {
  readonly data: Buffer;
  readonly width: number;
  readonly height: number;
}

interface ImageDecoders {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  readonly [mime: string]: (buffer: Buffer) => ImageData;
}

const decoders = {
  /* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
  [MIME_BMP]: (buffer: Buffer) => Jimp.decoders[MIME_BMP](buffer),
  [MIME_JPEG]: (buffer: Buffer) => jpeg.decode(buffer),
  [MIME_PNG]: (buffer: Buffer) => PNG.sync.read(buffer)
  /* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */
} as const satisfies ImageDecoders;

interface ImageEncoders {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  readonly [mime: string]: (imageData: ImageDataLike) => Buffer;
}

const encoders = {
  /* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
  [MIME_BMP]: (imageData: ImageDataLike) => Jimp.encoders[MIME_BMP]({ bitmap: imageData }),
  [MIME_JPEG]: (imageData: ImageDataLike) => jpeg.encode(imageData).data,
  [MIME_PNG]: (imageData: ImageDataLike) => {
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

// eslint-disable-next-line @typescript-eslint/naming-convention
const Image = {
  /**
   * Create ImageData from image.
   *
   * @param {ArrayBuffer} arrayBuffer - Image buffer.
   * @returns {Promise<ImageData>} Resolves to ImageData.
   * @access private
   */
  async decode (arrayBuffer: Readonly<ArrayBuffer>): Promise<ImageData> {
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
   * Create image from ImageData.
   *
   * @param {ImageData} image - Data.
   * @param {string} mime - MIME type.
   * @returns {Promise<ArrayBuffer>} Resolves to image.
   * @access private
   */
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/require-await
  async encode (image: ImageData, mime: string = MIME_PNG): Promise<ArrayBuffer> {
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

export default Image;
