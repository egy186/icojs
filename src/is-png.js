'use strict';

/**
 * Check the ArrayBuffer is valid PNG.
 * @access private
 * @param {ArrayBuffer} arrayBuffer ArrayBuffer object
 * @returns {Boolean} arg is PNG or not
 */
const isPNG = arrayBuffer => {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    return false;
  }
  const dataView = new DataView(arrayBuffer);
  return dataView.getUint32(0, false) === 0x89504E47 && dataView.getUint32(4, false) === 0x0D0A1A0A;
};

module.exports = isPNG;
