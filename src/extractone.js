'use strict';

const util = require('./util');

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
const extractOne = function (buffer, index) {
  const dv = new DataView(buffer);
  const icoWidth = dv.getUint8(6 + index * 16) || 256;
  const icoHeight = dv.getUint8(7 + index * 16) || 256;
  const icoOffset = dv.getUint32(18 + index * 16, true);
  const icoBit = dv.getUint16(icoOffset + 14, true);
  const icoColorsOffset = dv.getUint32(18 + index * 16, true) + dv.getUint32(icoOffset, true);
  const icoColorsCount = dv.getUint32(icoOffset + 32, true);
  const icoXorOffset = icoColorsOffset + icoColorsCount * 4;
  const icoAndOffset = icoXorOffset + util.toDividableBy4(icoWidth * icoBit / 8) * icoHeight;

  const ico = {
    width: icoWidth,
    height: icoHeight,
    colorCount: dv.getUint8(8 + index * 16),
    bit: icoBit,
    colors: [],
    xor: buffer.slice(icoXorOffset, icoAndOffset),
    and: buffer.slice(icoAndOffset, icoAndOffset + util.toDividableBy4(icoWidth / 8) * icoHeight)
  };
  for (let i = 0; i < icoColorsCount; i++) {
    ico.colors.push(util.to8bitArray(buffer.slice(icoColorsOffset + i * 4, icoColorsOffset + i * 4 + 4)));
  }

  return ico;
};

module.exports = extractOne;
