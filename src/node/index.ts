import Image from './image.js';
import { MIME_PNG } from '../mime.js';
import type { ParsedImage } from '../parse.js';
import { isICO } from '../is-ico.js';
import { parse } from '../parse.js';

/**
 * @typedef {object} ParsedImage
 * @property {number} width Image width.
 * @property {number} height Image height.
 * @property {number} bpp Image color depth as bits per pixel.
 * @property {ArrayBuffer} buffer Image buffer.
 */

/**
 * Parse ICO and return some images.
 *
 * @alias module:ICO
 * @param {ArrayBuffer | Buffer} buffer - ICO file data.
 * @param {string} [mime=image/png] - MIME type for output.
 * @returns {Promise<Array<ParsedImage>>} Resolves to an array of {@link ParsedImage}.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const parseICO = async (buffer: ArrayBuffer | Buffer, mime: string = MIME_PNG): Promise<Array<ParsedImage>> => await parse(buffer, mime, Image);

/**
 * @module ICO
 */
const ICO = {
  isICO,
  parseICO
};

export type { ParsedImage };

export { isICO, parseICO };

export default ICO;
