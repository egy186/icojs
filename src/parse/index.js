'use strict';

const bitDepthOfPNG = require('../bit-depth-of-png');
const parsedImage = require('./parsed-image');
const isPNG = require('../is-png');
const parseBMP = require('../parse-bmp');
const split = require('./split');

/**
 * Parse ICO and return some image object.
 * @access private
 * @param {ArrayBuffer} arrayBuffer ICO file data.
 * @param {String} mime MIME type for output.
 * @param {Object} Image Image encoder/decoder
 * @returns {Promise<ParsedImage[]>} Resolves to an array of {@link ParsedImage}.
 */
const parse = (arrayBuffer, mime, Image) => {
  let icons = [];
  try {
    icons = split(arrayBuffer);
  } catch (err) {
    return Promise.reject(err);
  }

  const parseIconImage = (width, height, iconImage) => {
    if (isPNG(iconImage)) {
      const bit = bitDepthOfPNG(iconImage);
      return Image.decode(iconImage).then(imageData => Object.assign(imageData, { bit }));
    }
    return Promise.resolve(parseBMP(width, height, iconImage));
  };
  const parsedImages = icons
    .map(iconImageData => parseIconImage(iconImageData.width, iconImageData.height, iconImageData.iconImage)
      .then(imageData => Image.encode(imageData, mime)
        .then(imageBuffer => parsedImage(iconImageData, imageBuffer, imageData.bit))));
  return Promise.all(parsedImages);
};

module.exports = parse;
