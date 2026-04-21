import type { DecodeImage } from '../decode.js';
import type { EncodeImage } from '../encode.js';
import { Image } from './image.js';
import { decode } from '../decode.js';
import { encode } from '../encode.js';
import { isIco } from '../is-ico.js';

/**
 * Decode ICO and return some images.
 *
 * @param buffer - ICO file data.
 * @param mime - MIME type for output.
 * @returns Resolves to an array of {@link DecodeImage}.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const decodeIco = async (buffer: ArrayBuffer | Buffer, mime = 'image/png'): Promise<Array<DecodeImage>> => await decode(buffer, mime, Image);

/**
 * Encode images into ICO.
 *
 * @param encodeImageList - An array of image to encode.
 * @returns Resolves to an ArrayBuffer of ICO.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const encodeIco = async (encodeImageList: ReadonlyArray<EncodeImage>): Promise<ArrayBuffer> => await encode(encodeImageList, Image);

const ICO = {
  decodeIco,
  encodeIco,
  isIco
};

export type { DecodeImage, EncodeImage };

export { decodeIco, encodeIco, isIco };

export default ICO;
