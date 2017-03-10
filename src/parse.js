'use strict';

const Image = require('./image');
const parseICO = require('./parse-ico');

/**
 * Parse ICO and return some images.
 * @memberof ICO
 * @param {ArrayBuffer} arrayBuffer The ArrayBuffer object contain the TypedArray of a ICO file.
 * @param {String} [mime=image/png] MIME type for output.
 * @returns {Promise<Object[]>} Resolves to array of parsed ICO.
 *   * `width` **Number** - Image width.
 *   * `height` **Number** - Image height.
 *   * `bit` **Number** - Image bit depth.
 *   * `buffer` **ArrayBuffer** - Image buffer.
 */
const parse = (arrayBuffer, mime) => parseICO(arrayBuffer, mime, Image);

module.exports = parse;
