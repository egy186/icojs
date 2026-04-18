import type { DecodeImage } from '../decode.js';
import Image from './image.js';
import { decode } from '../decode.js';
import { deprecate } from 'node:util';
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

/** @deprecated Use {@link isIco} instead. */
const isICO = deprecate(
  isIco,
  'isICO is deprecated. Use isIco instead.'
);

/**
 * Parse ICO and return some images.
 *
 * @param buffer - ICO file data.
 * @param mime - MIME type for output.
 * @returns Resolves to an array of {@link DecodeImage}.
 * @deprecated Use {@link decodeIco} instead.
 */
const parseICO = deprecate(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  async (buffer: ArrayBuffer | Buffer, mime = 'image/png'): Promise<Array<DecodeImage>> => await decode(buffer, mime, Image),
  'parseICO is deprecated. Use decodeIco instead.'
);

const ICO = {
  decodeIco,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  isICO,
  isIco,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  parseICO
};

export type { DecodeImage };

// eslint-disable-next-line @typescript-eslint/no-deprecated
export { decodeIco, isICO, isIco, parseICO };

export default ICO;
