/* jshint node: true */

'use strict';

var util = require('./util');

/**
 * extract an icon from buffer
 * @param {ArrayBuffer} buffer ico buffer
 * @param {number} index index of icon
 * @returns {Object} ico parsed ico
 * @returns {Number} ico.width image width
 * @returns {Number} ico.height image height
 * @returns {Number} ico.colorCount color count
 * @returns {Number} ico.bit bit depth
 * @returns {Array[]} ico.colors color palette
 * @returns {ArrayBuffer} ico.xor xor image
 * @returns {ArrayBuffer} ico.and xor and
 */
var extractOne = function (buffer, index) {
  var dv = new DataView(buffer);
  var ico = {
    width: dv.getUint8(6 + index * 16) || 256,
    height: dv.getUint8(7 + index * 16) || 256,
    colorCount: dv.getUint8(8 + index * 16)
  };
  var icoSize = dv.getUint32(14 + index * 16, true);
  var icoOffset = dv.getUint32(18 + index * 16, true);
  var icoBuffer = buffer.slice(icoOffset, icoOffset + icoSize);
  var icoDv = new DataView(icoBuffer);
  var icoHeaderSize = icoDv.getUint32(0, true);
  var icoColorsCount = icoDv.getUint32(32, true);

  ico.bit = icoDv.getUint16(14, true);
  ico.colors = [];
  for (var i = 0; i < icoColorsCount; i++) {
    ico.colors.push(util.to8bitArray(icoBuffer.slice(icoHeaderSize + i * 4, icoHeaderSize + i * 4 + 4)));
  }
  var icoXorOffset = icoHeaderSize + icoColorsCount * 4;
  var xorLine = ico.width * ico.bit / 8;
  if (xorLine % 4 !== 0) {
    xorLine += 4 - xorLine % 4;
  }
  var icoAndOffset = icoXorOffset + xorLine * ico.height;
  ico.xor = icoBuffer.slice(icoXorOffset, icoAndOffset);
  var andLine = ico.width / 8;
  if (andLine % 4 !== 0) {
    andLine += 4 - andLine % 4;
  }
  ico.and = icoBuffer.slice(icoAndOffset, icoAndOffset + andLine * ico.height);
  return ico;
};

module.exports = extractOne;
