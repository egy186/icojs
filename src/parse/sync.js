'use strict';

const decodeIco = require('decode-ico');

/**
 * Parse ICO and return some image object.
 * @access private
 * @param {ArrayBuffer|Buffer} data ICO file data.
 * @param {String} mime MIME type for output.
 * @param {Object} Image Image encoder/decoder
 * @returns {ParsedImage[]} Resolves to an array of {@link ParsedImage}.
 */
const parseSync = (data, mime, Image) => {
  const icons = decodeIco(data);

  const transcodeImage = icon => {
    if (mime === 'image/png' && icon.type === 'png') {
      return icon;
    }

    if (icon.type === 'png') {
      const decoded = Image.decodeSync(icon.data);
      Object.assign(icon, {
        type: 'bmp',
        data: decoded.data
      });
    }

    return Object.assign(icon, {
      type: mime.replace('image/', ''),
      data: Image.encodeSync(icon, mime)
    });
  };

  return icons.map(transcodeImage);
};

module.exports = parseSync;
