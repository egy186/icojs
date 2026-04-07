import type { ImageConverter } from './image.js';
import { MIME_PNG } from './mime.js';
import decodeIco from 'decode-ico';

interface Hotspot {
  readonly x: number;
  readonly y: number;
}

interface ParsedImage {
  readonly width: number;
  readonly height: number;
  /** Color depth as bits per pixel. */
  readonly bpp: number;
  readonly buffer: ArrayBuffer;
  /** This field is present only when the format is CUR. */
  readonly hotspot?: Hotspot;
}

interface IconData {
  readonly type: string;
  readonly data: Uint8Array | Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
  readonly bpp: number;
}

/**
 * Parse ICO and return some image object.
 *
 * @param {ArrayBuffer | Buffer} data - ICO file data.
 * @param {string} mime - MIME type for output.
 * @param {ImageConverter} Image - Image encoder/decoder.
 * @returns {Promise<Array<ParsedImage>>} Resolves to an array of {@link ParsedImage}.
 * @access private
 */
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/prefer-readonly-parameter-types
const parse = async (data: ArrayBuffer | Buffer, mime: string, Image: ImageConverter): Promise<Array<ParsedImage>> => {
  const icons = decodeIco(data);

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const transcodeImage = async (icon: IconData): Promise<ParsedImage> => {
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

  const parsedImages = await Promise.all(icons.map(transcodeImage));
  return parsedImages;
};

export type { ParsedImage };

export { parse };

export default parse;
