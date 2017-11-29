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
 * @returns {ParsedImage[]} Resolves to an array of {@link ParsedImage}.
 */
const parse = (arrayBuffer, mime, Image) => {
  const icons = split(arrayBuffer);

  const parseIconImage = (width, height, iconImage) => {
    if (isPNG(iconImage)) {
      const bit = bitDepthOfPNG(iconImage);
      const imageData = Image.decodeSync(iconImage);
      return Object.assign(imageData, { bit });
    }
    return parseBMP(width, height, iconImage);
  };
  const parsedImages = icons
    .map(iconImageData => {
      const imageData = parseIconImage(iconImageData.width, iconImageData.height, iconImageData.iconImage);
      const imageBuffer = Image.encodeSync(imageData, mime);
      return parsedImage(iconImageData, imageBuffer, imageData.bit);
    });
  return parsedImages;
};

module.exports = parse;
