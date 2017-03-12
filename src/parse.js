'use strict';

const Image = require('./image');
const parseICO = require('./parse-ico');

/**
 * Parse ICO and return some images.
 * @memberof ICO
 * @param {ArrayBuffer|Buffer} buffer ICO file data.
 * @param {String} [mime=image/png] MIME type for output.
 * @returns {Promise<Object[]>} Resolves to array of parsed ICO.
 *   * `width` **Number** - Image width.
 *   * `height` **Number** - Image height.
 *   * `bit` **Number** - Image bit depth.
 *   * `buffer` **ArrayBuffer** - Image buffer.
 */
const parse = (buffer, mime) => parseICO(buffer, mime, Image);

module.exports = parse;
