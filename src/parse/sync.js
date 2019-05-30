'use strict';

const decodeIco = require('decode-ico');
const { MIME_PNG } = require('../mime');

/**
 * Parse ICO and return some image object.
 *
 * @access private
 * @param {ArrayBuffer|Buffer} data - ICO file data.
 * @param {string} mime - MIME type for output.
 * @param {object} Image - Image encoder/decoder.
 * @returns {ParsedImage[]} Resolves to an array of {@link ParsedImage}.
 */
const parseSync = (data, mime, Image) => {
  const icons = decodeIco(data);

  const transcodeImage = icon => {
    if (mime === MIME_PNG && icon.type === 'png') {
      return Object.assign({ buffer: icon.data.buffer.slice(icon.data.byteOffset, icon.data.byteOffset + icon.data.byteLength) }, icon);
    }

    if (icon.type === 'png') {
      const decoded = Image.decodeSync(icon.data);
      Object.assign(icon, {
        data: decoded.data,
        type: 'bmp'
      });
    }

    return Object.assign(icon, {
      buffer: Image.encodeSync(icon, mime),
      type: mime.replace('image/', '')
    });
  };

  const parsedImages = icons.map(transcodeImage);
  return parsedImages;
};

module.exports = parseSync;
