'use strict';

const bitArray = require('./utils/bit-array');
const toDividableBy4 = require('./utils/to-dividable-by-4');

const imageData = {
  /**
   * make 1bit image imageData.data
   * @access private
   * @param {Object} ico should have width, height, bit, colors, xor, and
   * @returns {Uint8ClampedArray} imageData.data
   */
  from1bit (ico) {
    const xor = bitArray.of1(ico.xor);
    const and = bitArray.of1(ico.and);
    const xorLine = toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
    const andLine = toDividableBy4(ico.width / 8) * 8;
    let index = 0;
    const data = new Uint8ClampedArray(ico.width * ico.height * 4);
    for (let h = ico.height - 1; h >= 0; h--) {
      for (let w = 0; w < ico.width; w++) {
        const color = ico.colors[xor[(h * xorLine) + w]];
        data[index] = color[2];
        data[index + 1] = color[1];
        data[index + 2] = color[0];
        data[index + 3] = and[(h * andLine) + w] ? 0 : 255;
        index += 4;
      }
    }
    return data;
  },
  /**
   * make 4bit image imageData.data
   * @access private
   * @param {Object} ico should have width, height, bit, colors, xor, and
   * @returns {Uint8ClampedArray} imageData.data
   */
  from4bit (ico) {
    const xor = bitArray.of4(ico.xor);
    const and = bitArray.of1(ico.and);
    const xorLine = toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
    const andLine = toDividableBy4(ico.width / 8) * 8;
    let index = 0;
    const data = new Uint8ClampedArray(ico.width * ico.height * 4);
    for (let h = ico.height - 1; h >= 0; h--) {
      for (let w = 0; w < ico.width; w++) {
        const color = ico.colors[xor[(h * xorLine) + w]];
        data[index] = color[2];
        data[index + 1] = color[1];
        data[index + 2] = color[0];
        data[index + 3] = and[(h * andLine) + w] ? 0 : 255;
        index += 4;
      }
    }
    return data;
  },
  /**
   * make 8bit image imageData.data
   * @private
   * @param {Object} ico should have width, height, bit, colors, xor, and
   * @returns {Uint8ClampedArray} imageData.data
   */
  from8bit (ico) {
    const xor = new Uint8Array(ico.xor);
    const and = bitArray.of1(ico.and);
    const xorLine = toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
    const andLine = toDividableBy4(ico.width / 8) * 8;
    let index = 0;
    const data = new Uint8ClampedArray(ico.width * ico.height * 4);
    for (let h = ico.height - 1; h >= 0; h--) {
      for (let w = 0; w < ico.width; w++) {
        const color = ico.colors[xor[(h * xorLine) + w]];
        data[index] = color[2];
        data[index + 1] = color[1];
        data[index + 2] = color[0];
        data[index + 3] = and[(h * andLine) + w] ? 0 : 255;
        index += 4;
      }
    }
    return data;
  },
  /**
   * make 24bit image imageData.data
   * @private
   * @param {Object} ico should have width, height, bit, xor, and
   * @returns {Uint8ClampedArray} imageData.data
   */
  from24bit (ico) {
    const xor = new Uint8Array(ico.xor);
    const and = bitArray.of1(ico.and);
    const xorLine = toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
    const andLine = toDividableBy4(ico.width / 8) * 8;
    let index = 0;
    const data = new Uint8ClampedArray(ico.width * ico.height * 4);
    for (let h = ico.height - 1; h >= 0; h--) {
      for (let w = 0; w < ico.width; w++) {
        data[index] = xor[(((h * xorLine) + w) * 3) + 2];
        data[index + 1] = xor[(((h * xorLine) + w) * 3) + 1];
        data[index + 2] = xor[((h * xorLine) + w) * 3];
        data[index + 3] = and[(h * andLine) + w] ? 0 : 255;
        index += 4;
      }
    }
    return data;
  },
  /**
   * make 32bit image imageData.data
   * @private
   * @param {Object} ico should have width, height, bit, xor, and
   * @returns {Uint8ClampedArray} imageData.data
   */
  from32bit (ico) {
    const xor = new Uint8Array(ico.xor);
    const and = bitArray.of1(ico.and);
    const xorLine = toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
    const andLine = toDividableBy4(ico.width / 8) * 8;
    let index = 0;
    const data = new Uint8ClampedArray(ico.width * ico.height * 4);
    for (let h = ico.height - 1; h >= 0; h--) {
      for (let w = 0; w < ico.width; w++) {
        data[index] = xor[(((h * xorLine) + w) * 4) + 2];
        data[index + 1] = xor[(((h * xorLine) + w) * 4) + 1];
        data[index + 2] = xor[((h * xorLine) + w) * 4];
        data[index + 3] = and[(h * andLine) + w] === 1 || xor[(((h * xorLine) + w) * 4) + 3] === 1 ? 0 : xor[(((h * xorLine) + w) * 4) + 3] > 1 ? xor[(((h * xorLine) + w) * 4) + 3] : 255; // eslint-disable-line no-nested-ternary
        index += 4;
      }
    }
    return data;
  }
};

module.exports = imageData;
