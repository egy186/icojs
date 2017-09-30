'use strict';

/**
 * Check the ArrayBuffer is valid ICO.
 * @memberof ICO
 * @param {ArrayBuffer} arrayBuffer ICO file data.
 * @returns {Boolean} True if arg is ICO.
 */
const isICO = arrayBuffer => {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    return false;
  }
  const dataView = new DataView(arrayBuffer);
  return dataView.getUint16(0, true) === 0 && dataView.getUint16(2, true) === 1;
};

module.exports = isICO;
