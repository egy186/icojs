'use strict';

const isCUR = require('../is-cur');
const isICO = require('../is-ico');
const range = require('../utils/range');

/**
 * @typedef {Object} IconImageData
 * @property {Number} width Image width.
 * @property {Number} height Image height.
 * @property {ArrayBuffer} iconImage Image buffer.
 */

/**
 * Parse ICO and return some image object.
 * @access private
 * @param {ArrayBuffer} arrayBuffer ICO file data.
 * @returns {IconImageData[]} An array of {@link IconImageData}.
 */
const parseICO = arrayBuffer => {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    throw new TypeError('"buffer" argument must be an ArrayBuffer');
  }
  if (!isCUR(arrayBuffer) && !isICO(arrayBuffer)) {
    throw new Error('buffer is not ico');
  }
  const dataView = new DataView(arrayBuffer);

  const count = dataView.getUint16(4, true);
  const infoHeaders = range(count)
    .map(index => {
      const length = 16;
      const offset = 6 + (index * length);
      return arrayBuffer.slice(offset, offset + length);
    });
  const icons = range(count)
    .map(index => {
      const infoHeader = new DataView(infoHeaders[index]);
      const iconImageLength = infoHeader.getUint32(8, true);
      const iconImageOffset = infoHeader.getUint32(12, true);

      const iconImageData = {
        height: infoHeader.getUint8(1) || 256,
        iconImage: arrayBuffer.slice(iconImageOffset, iconImageOffset + iconImageLength),
        width: infoHeader.getUint8(0) || 256
      };
      if (isCUR(arrayBuffer)) {
        iconImageData.hotspot = {
          x: infoHeader.getUint16(4, true),
          y: infoHeader.getUint16(6, true)
        };
      }
      return iconImageData;
    });
  return icons;
};

module.exports = parseICO;
