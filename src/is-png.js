'use strict';

const toDataView = require('to-data-view');

/**
 * Check the ArrayBuffer is valid PNG.
 *
 * @param {ArrayBuffer|Buffer} source - ArrayBuffer or Buffer object.
 * @returns {boolean} Arg is PNG or not.
 * @access private
 */
const isPNG = source => {
  const dataView = toDataView(source);
  return dataView.getUint32(0, false) === 0x89504E47 && dataView.getUint32(4, false) === 0x0D0A1A0A;
};

module.exports = isPNG;
