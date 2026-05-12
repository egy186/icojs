import type { DecodeImage } from '../decode.js';
import type { EncodeImage } from '../encode.js';
import { decode } from '../decode.js';
import { encode } from '../encode.js';
import { imageConverter } from './image.js';
import { isIco } from '../is-ico.js';

/**
 * Decode an ICO buffer into images.
 *
 * @param buffer - ICO file buffer.
 * @param mime - MIME type for output.
 * @returns Resolves to an array of decoded image objects.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const decodeIco = async (buffer: ArrayBuffer | Buffer, mime = 'image/png'): Promise<Array<DecodeImage>> => await decode(buffer, mime, imageConverter);

/**
 * Encode images into an ICO buffer.
 *
 * @param encodeImageList - An array of image objects to encode.
 * @returns Resolves to an ICO buffer.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const encodeIco = async (encodeImageList: ReadonlyArray<EncodeImage>): Promise<ArrayBuffer> => await encode(encodeImageList, imageConverter);

const ICO = {
  decodeIco,
  encodeIco,
  isIco
};

export type { DecodeImage, EncodeImage };

export { decodeIco, encodeIco, isIco };

export default ICO;
