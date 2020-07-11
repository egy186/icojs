'use strict';

const Image = require('./image');
const isICO = require('../is-ico');
const parseICO = require('../parse');
const { MIME_PNG } = require('../mime');

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

module.exports = ICO;
