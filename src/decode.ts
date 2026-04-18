import type { ImageConverter } from './image.js';
import { MIME_PNG } from './image.js';
import decodeIco from 'decode-ico';

// eslint-disable-next-line jsdoc/no-blank-blocks
/** */
interface DecodeImage {
  /** Image width. */
  readonly width: number;
  /** Image height. */
  readonly height: number;
  /** Color depth as bits per pixel. */
  readonly bpp: number;
  /** Image buffer. */
  readonly buffer: ArrayBuffer;
  /** This field is present only when the format is CUR. */
  readonly hotspot?: {
    readonly x: number;
    readonly y: number;
  };
}

interface IconData {
  readonly type: string;
  readonly data: Uint8Array | Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
  readonly bpp: number;
}

/**
 * Decode ICO and return some image object.
 *
 * @param data - ICO file data.
 * @param mime - MIME type for output.
 * @param Image - Image encoder/decoder.
 * @returns Resolves to an array of {@link DecodeImage}.
 * @access private
 */
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/prefer-readonly-parameter-types
const decode = async (data: ArrayBuffer | Buffer, mime: string, Image: ImageConverter): Promise<Array<DecodeImage>> => {
  const icons = decodeIco(data);

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const transcodeImage = async (icon: IconData): Promise<DecodeImage> => {
    if (mime === MIME_PNG && icon.type === 'png') {
      return {
        ...icon,
        buffer: new Uint8Array(icon.data).buffer
      };
    }

    if (icon.type === 'png') {
      const decoded = await Image.decode(new Uint8Array(icon.data).buffer);
      Object.assign(icon, {
        data: decoded.data,
        type: 'bmp'
      });
    }

    return Object.assign(icon, {
      buffer: await Image.encode(icon, mime),
      type: mime.replace('image/', '')
    });
  };

  const decodedImages = await Promise.all(icons.map(transcodeImage));
  return decodedImages;
};

export type { DecodeImage };

export { decode };

export default decode;
