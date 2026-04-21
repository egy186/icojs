import type { DecodeImage } from '../decode.js';
import Image from './image.js';
import { decode } from '../decode.js';
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

const ICO = {
  decodeIco,
  isIco
};

export type { DecodeImage };

export { decodeIco, isIco };

export default ICO;
