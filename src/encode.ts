import type { ImageConverter } from './image.js';
import { MIME_PNG } from './image.js';
import { createBmpIcon } from './bmp-icon.js';
import { isPng } from './is-png.js';

interface IconImage {
  readonly buffer: Readonly<ArrayBuffer>;
  readonly width: number;
  readonly height: number;
  readonly hotspot?: {
    readonly x: number;
    readonly y: number;
  } | undefined;
}

class ICO {
  /* eslint-disable @typescript-eslint/naming-convention */
  public static readonly MAX_DIMENSION = 256;

  static readonly #FILE_HEADER_SIZE = 6;

  static readonly #DIRECTORY_SIZE = 16;
  /* eslint-enable @typescript-eslint/naming-convention */

  readonly #buffer: Uint8Array<ArrayBuffer>;

  public constructor (iconImageList: ReadonlyArray<IconImage>) {
    const headerSize = ICO.#FILE_HEADER_SIZE + (ICO.#DIRECTORY_SIZE * iconImageList.length);
    const bodySize = iconImageList.reduce((sum, { buffer }) => sum + buffer.byteLength, 0);

    this.#buffer = new Uint8Array(headerSize + bodySize);

    this.#setHeader(iconImageList.length, ICO.#isCur(iconImageList));

    let offset = headerSize;
    for (const [index, iconImage] of iconImageList.entries()) {
      this.#setDirectory(index, iconImage, offset);

      offset += this.#setData(offset, iconImage.buffer);
    }
  }

  public get buffer (): ArrayBuffer {
    return this.#buffer.buffer;
  }

  static #isCur (iconImageList: ReadonlyArray<IconImage>): boolean {
    return iconImageList.some(iconImage => Number.isInteger(iconImage.hotspot?.x) && Number.isInteger(iconImage.hotspot?.y));
  }

  #setHeader (count: number, isCur: boolean): void {
    const view = new DataView(this.#buffer.buffer, 0, ICO.#FILE_HEADER_SIZE);

    // Reserved
    view.setUint16(0, 0, true);
    view.setUint16(2, isCur ? 2 : 1, true);
    view.setUint16(4, count, true);
  }

  #setDirectory (index: number, iconImage: IconImage, dataOffset: number): void {
    const offset = ICO.#FILE_HEADER_SIZE + (ICO.#DIRECTORY_SIZE * index);
    const view = new DataView(this.#buffer.buffer, offset, ICO.#DIRECTORY_SIZE);

    view.setUint8(0, iconImage.width >= ICO.MAX_DIMENSION ? 0 : iconImage.width);
    view.setUint8(1, iconImage.height >= ICO.MAX_DIMENSION ? 0 : iconImage.height);
    // No color palette
    view.setUint8(2, 0);
    // Reserved
    view.setUint8(3, 0);
    view.setUint16(4, iconImage.hotspot?.x ?? 0, true);
    view.setUint16(6, iconImage.hotspot?.y ?? 0, true);
    view.setUint32(8, iconImage.buffer.byteLength, true);
    view.setUint32(12, dataOffset, true);
  }

  #setData (offset: number, data: Readonly<ArrayBuffer>): number {
    this.#buffer.set(new Uint8Array(data), offset);

    return data.byteLength;
  }
}

/**
 * Image object for encoding.
 */
interface EncodeImage {
  /** Image buffer. */
  readonly buffer: ArrayBuffer | Buffer;
  /** Whether to use PNG format for the image. Defaults to `true` when the image dimensions are 256px, `false` otherwise. */
  readonly usePngIcon?: boolean;
  /** Cursor hotspot coordinates for a CUR file. */
  readonly hotspot?: {
    readonly x: number;
    readonly y: number;
  } | undefined;
}

/**
 * Encode images into an ICO buffer.
 *
 * @param encodeImageList - An array of image objects to encode.
 * @param imageConverter - Image encoder/decoder.
 * @returns Resolves to an ICO buffer.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const encode = async (encodeImageList: ReadonlyArray<EncodeImage>, imageConverter: ImageConverter): Promise<ArrayBuffer> => {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const iconImageList = await Promise.all(encodeImageList.map(async (encodeImage): Promise<IconImage> => {
    let buffer = encodeImage.buffer instanceof ArrayBuffer ? encodeImage.buffer : new Uint8Array(encodeImage.buffer).buffer;
    const decoded = await imageConverter.decode(buffer);

    const usePngIcon = encodeImage.usePngIcon === true || decoded.width >= ICO.MAX_DIMENSION || decoded.height >= ICO.MAX_DIMENSION;
    if (!usePngIcon) {
      buffer = createBmpIcon(decoded);
    } else if (!isPng(encodeImage.buffer)) {
      // Encode only when the buffer is not PNG
      buffer = await imageConverter.encode(decoded, MIME_PNG);
    }

    return {
      buffer,
      height: decoded.height,
      hotspot: encodeImage.hotspot,
      width: decoded.width
    };
  }));

  const ico = new ICO(iconImageList);

  return ico.buffer;
};

export type { EncodeImage };

export { encode };

export default encode;
