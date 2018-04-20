'use strict';

const Image = require('./image');
const isICO = require('../is-ico');
const parseICO = require('../parse');
const { MIME_PNG } = require('../mime');

const globalICO = global.ICO;

/**
 * Parse ICO and return some images.
 * @memberof ICO
 * @param {ArrayBuffer} arrayBuffer ICO file data.
 * @param {String} [mime=image/png] MIME type for output.
 * @returns {Promise<ParsedImage[]>} Resolves to an array of {@link ParsedImage}.
 */
const parse = (arrayBuffer, mime = MIME_PNG) => parseICO(arrayBuffer, mime, Image);

/**
 * @class ICO
 */
const ICO = {
  isICO,
  /**
   * No conflict.
   * @memberof ICO
   * @returns {ICO} `ICO` Object.
   */
  noConflict () {
    global.ICO = globalICO;
    return this;
  },
  parse
};

module.exports = ICO;
