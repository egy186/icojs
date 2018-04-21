'use strict';

const Image = require('./image');
const isICO = require('../is-ico');
const parseICO = require('../parse');
const parseICOSync = require('../parse/sync');

/**
 * Parse ICO and return some images.
 * @alias module:ICO
 * @param {ArrayBuffer|Buffer} buffer ICO file data.
 * @param {String} [mime=image/png] MIME type for output.
 * @returns {Promise<ParsedImage[]>} Resolves to an array of {@link ParsedImage}.
 */
const parse = (buffer, mime) => parseICO(buffer, mime || 'image/png', Image);

/**
 * Parse ICO and return some images synchronously **(Node.js only)**.
 * @alias module:ICO
 * @param {ArrayBuffer|Buffer} buffer ICO file data.
 * @param {String} [mime=image/png] MIME type for output.
 * @returns {ParsedImage[]} Returns an array of {@link ParsedImage}.
 */
const parseSync = (buffer, mime) => parseICOSync(buffer, mime || 'image/png', Image);

/**
 * @module ICO
 */
const ICO = {
  isICO,
  parse,
  parseSync
};

module.exports = ICO;
