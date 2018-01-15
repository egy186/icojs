'use strict';

/**
 * @typedef {Object} ParsedImage
 * @property {Number} width Image width.
 * @property {Number} height Image height.
 * @property {Number} bit Image bit depth.
 * @property {ArrayBuffer} buffer Image buffer.
 */

/**
 * Create ParsedImage
 * @access private
 * @param {ImageData} imageData ImageData object.
 * @param {ArrayBufer} imageBuffer Image buffer.
 * @param {Object} hotspot Hotspot of CUR file.
 * @returns {ParsedImage} ImageData like object.
 */
const parsedImage = (imageData, imageBuffer, hotspot) => {
  const image = {
    bit: imageData.bit,
    buffer: imageBuffer,
    height: imageData.height,
    width: imageData.width
  };
  if (hotspot) {
    image.hotspot = hotspot;
  }
  return image;
};

module.exports = parsedImage;
