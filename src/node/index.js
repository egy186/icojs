'use strict';

const Image = require('./image');
const arrayBufferIsICO = require('../is-ico');
const bufferToArrayBuffer = require('./buffer-to-arraybuffer');
const parseICO = require('../parse');
const parseICOSync = require('../parse/sync');

/**
 * Check the ArrayBuffer is valid ICO.
 * @alias module:ICO
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
 * @alias module:ICO
 * @param {ArrayBuffer|Buffer} buffer ICO file data.
 * @param {String} [mime=image/png] MIME type for output.
 * @returns {Promise<ParsedImage[]>} Resolves to an array of {@link ParsedImage}.
 */
const parse = (buffer, mime) => {
  const arrayBuffer = bufferToArrayBuffer(buffer);
  if (!arrayBuffer) {
    return Promise.reject(new TypeError('"buffer" argument must be a Buffer or ArrayBuffer'));
  }
  return parseICO(arrayBuffer, mime || 'image/png', Image);
};

/**
 * Parse ICO and return some images synchronously.
 * @alias module:ICO
 * @param {ArrayBuffer|Buffer} buffer ICO file data.
 * @param {String} [mime=image/png] MIME type for output.
 * @returns {ParsedImage[]} Returns an array of {@link ParsedImage}.
 */
const parseSync = (buffer, mime) => {
  const arrayBuffer = bufferToArrayBuffer(buffer);
  if (!arrayBuffer) {
    throw new TypeError('"buffer" argument must be a Buffer or ArrayBuffer');
  }
  return parseICOSync(arrayBuffer, mime || 'image/png', Image);
};

/**
 * @module ICO
 */
const ICO = {
  isICO,
  parse,
  parseSync
};

module.exports = ICO;
