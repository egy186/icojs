import Image from './image.js';
import type { ParsedImage } from '../parse.js';
import { isICO } from '../is-ico.js';
import { parse } from '../parse.js';

/**
 * Parse ICO and return some images.
 *
 * @param {ArrayBuffer | Buffer} buffer - ICO file data.
 * @param {string} [mime=image/png] - MIME type for output.
 * @returns {Promise<Array<ParsedImage>>} Resolves to an array of {@link ParsedImage}.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const parseICO = async (buffer: ArrayBuffer | Buffer, mime = 'image/png'): Promise<Array<ParsedImage>> => await parse(buffer, mime, Image);

const ICO = {
  isICO,
  parseICO
};

export type { ParsedImage };

export { isICO, parseICO };

export default ICO;
