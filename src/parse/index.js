'use strict';

const decodeIco = require('decode-ico');
const { MIME_PNG } = require('../mime');

/**
 * @typedef {object} ParsedImage
 * @property {number} width Image width.
 * @property {number} height Image height.
 * @property {number} bpp Image color depth as bits per pixel.
 * @property {ArrayBuffer} buffer Image buffer.
 */

/**
 * Parse ICO and return some image object.
 *
 * @access private
 * @param {ArrayBuffer|Buffer} data - ICO file data.
 * @param {string} mime - MIME type for output.
 * @param {object} Image - Image encoder/decoder.
 * @returns {Promise<ParsedImage[]>} Resolves to an array of {@link ParsedImage}.
 */
const parse = async (data, mime, Image) => {
  const icons = decodeIco(data);

  const transcodeImage = async icon => {
    if (mime === MIME_PNG && icon.type === 'png') {
      return Object.assign({ buffer: icon.data.buffer.slice(icon.data.byteOffset, icon.data.byteOffset + icon.data.byteLength) }, icon);
    }

    if (icon.type === 'png') {
      const decoded = await Image.decode(icon.data);
      Object.assign(icon, {
        data: decoded.data,
        type: 'bmp'
      });
    }

    return Object.assign(icon, {
      buffer: await Image.encode(icon, mime),
      type: mime.replace('image/', '')
    });
  };

  const parsedImages = await Promise.all(icons.map(transcodeImage));
  return parsedImages;
};

module.exports = parse;
