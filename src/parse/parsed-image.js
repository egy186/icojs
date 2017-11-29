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
 * @param {IconImageData} iconImageData {@link IconImageData}
 * @param {ArrayBufer} imageBuffer Image buffer.
 * @param {Number} bit Image bit depth.
 * @returns {ParsedImage} ImageData like object.
 */
const parsedImage = (iconImageData, imageBuffer, bit) => {
  const image = {
    bit,
    buffer: imageBuffer,
    height: iconImageData.height,
    width: iconImageData.width
  };
  if (iconImageData.hotspot) {
    image.hotspot = iconImageData.hotspot;
  }
  return image;
};

module.exports = parsedImage;
