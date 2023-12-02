import Image from './image.js';
import { MIME_PNG } from '../mime.js';
import { isICO } from '../is-ico.js';
import parseICO from '../parse.js';

/**
 * Parse ICO and return some images.
 *
 * @alias module:ICO
 * @param {ArrayBuffer|Buffer} buffer - ICO file data.
 * @param {string} [mime=image/png] - MIME type for output.
 * @returns {Promise<ParsedImage[]>} Resolves to an array of {@link ParsedImage}.
 */
const parse = (buffer, mime = MIME_PNG) => parseICO(buffer, mime, Image);

/**
 * @module ICO
 */
const ICO = {
  isICO,
  parse
};

export { isICO, parse };

export default ICO;
