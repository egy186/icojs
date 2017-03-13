'use strict';

const bufferToArrayBuffer = require('./utils/buffer-to-arraybuffer');

/**
 * Check the ArrayBuffer is valid ICO.
 * @memberof ICO
 * @param {ArrayBuffer|Buffer} buffer ICO file data.
 * @returns {Boolean} True if arg is ICO.
 */
const isICO = buffer => {
  const arrayBuffer = bufferToArrayBuffer(buffer);
  if (!arrayBuffer) {
    return false;
  }
  const dataView = new DataView(arrayBuffer);
  return dataView.getUint16(0, true) === 0 && dataView.getUint16(2, true) === 1;
};

module.exports = isICO;
