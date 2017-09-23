'use strict';

const Image = require('./image');
const arrayBufferIsICO = require('../is-ico');
const bufferToArrayBuffer = require('./buffer-to-arraybuffer');
const parseICO = require('../parse-ico');

/**
 * Check the ArrayBuffer is valid ICO.
 * @memberof ICO
 * @param {ArrayBuffer|Buffer} buffer ICO file data.
 * @returns {Boolean} True if arg is ICO.
 */
const isICO = buffer => {
  const arrayBuffer = bufferToArrayBuffer(buffer);
  if (!arrayBuffer) {
    return false;
  }
  return arrayBufferIsICO(arrayBuffer);
};

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
const parse = (buffer, mime) => {
  const arrayBuffer = bufferToArrayBuffer(buffer);
  if (!arrayBuffer) {
    return Promise.reject(new TypeError('"buffer" argument must be a Buffer or ArrayBuffer'));
  }
  return parseICO(arrayBuffer, mime, Image);
};

/**
 * @class ICO
 */
const ICO = {
  isICO,
  parse
};

module.exports = ICO;
