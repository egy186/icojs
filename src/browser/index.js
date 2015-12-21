'use strict';

const extractOne = require('../extractone');
const PNG = require('./png');
const util = require('../util');

const range = n => new Array(n).fill(0).map((_, i) => i);

/**
 * make 1bit image imageData.data
 * @private
 * @param {Object} ico should have width, height, bit, colors, xor, and
 * @returns {Uint8ClampedArray} imageData.data
 */
const make1bitImageData = ico => {
  let color;
  const xor = util.to1bitArray(ico.xor);
  const and = util.to1bitArray(ico.and);
  const xorLine = util.toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
  const andLine = util.toDividableBy4(ico.width / 8) * 8;
  let index = 0;
  const data = new Uint8ClampedArray(ico.width * ico.height * 4);
  for (let h = ico.height - 1; h >= 0; h--) {
    for (let w = 0; w < ico.width; w++) {
      color = ico.colors[xor[h * xorLine + w]];
      data[index] = color[2];
      data[index + 1] = color[1];
      data[index + 2] = color[0];
      data[index + 3] = and[h * andLine + w] ? 0 : 255;
      index += 4;
    }
  }
  return data;
};

/**
 * make 4bit image imageData.data
 * @private
 * @param {Object} ico should have width, height, bit, colors, xor, and
 * @returns {Uint8ClampedArray} imageData.data
 */
const make4bitImageData = ico => {
  let color;
  const xor = util.to4bitArray(ico.xor);
  const and = util.to1bitArray(ico.and);
  const xorLine = util.toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
  const andLine = util.toDividableBy4(ico.width / 8) * 8;
  let index = 0;
  const data = new Uint8ClampedArray(ico.width * ico.height * 4);
  for (let h = ico.height - 1; h >= 0; h--) {
    for (let w = 0; w < ico.width; w++) {
      color = ico.colors[xor[h * xorLine + w]];
      data[index] = color[2];
      data[index + 1] = color[1];
      data[index + 2] = color[0];
      data[index + 3] = and[h * andLine + w] ? 0 : 255;
      index += 4;
    }
  }
  return data;
};

/**
 * make 8bit image imageData.data
 * @private
 * @param {Object} ico should have width, height, bit, colors, xor, and
 * @returns {Uint8ClampedArray} imageData.data
 */
const make8bitImageData = ico => {
  let color;
  const xor = new Uint8Array(ico.xor);
  const and = util.to1bitArray(ico.and);
  const xorLine = util.toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
  const andLine = util.toDividableBy4(ico.width / 8) * 8;
  let index = 0;
  const data = new Uint8ClampedArray(ico.width * ico.height * 4);
  for (let h = ico.height - 1; h >= 0; h--) {
    for (let w = 0; w < ico.width; w++) {
      color = ico.colors[xor[h * xorLine + w]];
      data[index] = color[2];
      data[index + 1] = color[1];
      data[index + 2] = color[0];
      data[index + 3] = and[h * andLine + w] ? 0 : 255;
      index += 4;
    }
  }
  return data;
};

/**
 * make 24bit image imageData.data
 * @private
 * @param {Object} ico should have width, height, bit, xor, and
 * @returns {Uint8ClampedArray} imageData.data
 */
const make24bitImageData = ico => {
  const xor = new Uint8Array(ico.xor);
  const and = util.to1bitArray(ico.and);
  const xorLine = util.toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
  const andLine = util.toDividableBy4(ico.width / 8) * 8;
  let index = 0;
  const data = new Uint8ClampedArray(ico.width * ico.height * 4);
  for (let h = ico.height - 1; h >= 0; h--) {
    for (let w = 0; w < ico.width; w++) {
      data[index] = xor[(h * xorLine + w) * 3 + 2];
      data[index + 1] = xor[(h * xorLine + w) * 3 + 1];
      data[index + 2] = xor[(h * xorLine + w) * 3];
      data[index + 3] = and[h * andLine + w] ? 0 : 255;
      index += 4;
    }
  }
  return data;
};

/**
 * make 32bit image imageData.data
 * @private
 * @param {Object} ico should have width, height, bit, xor, and
 * @returns {Uint8ClampedArray} imageData.data
 */
const make32bitImageData = ico => {
  const xor = new Uint8Array(ico.xor);
  const and = util.to1bitArray(ico.and);
  const xorLine = util.toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
  const andLine = util.toDividableBy4(ico.width / 8) * 8;
  let index = 0;
  const data = new Uint8ClampedArray(ico.width * ico.height * 4);
  for (let h = ico.height - 1; h >= 0; h--) {
    for (let w = 0; w < ico.width; w++) {
      data[index] = xor[(h * xorLine + w) * 4 + 2];
      data[index + 1] = xor[(h * xorLine + w) * 4 + 1];
      data[index + 2] = xor[(h * xorLine + w) * 4];
      data[index + 3] = and[h * andLine + w] === 1 || xor[(h * xorLine + w) * 4 + 3] === 1 ? 0 : xor[(h * xorLine + w) * 4 + 3] > 1 ? xor[(h * xorLine + w) * 4 + 3] : 255; // eslint-disable-line no-nested-ternary
      index += 4;
    }
  }
  return data;
};

const previousICO = global.ICO;

/**
 * @class ICO
 */
const ICO = {
  /**
   * Parse ICO and return some PNGs.
   * @param {ArrayBuffer} buffer The ArrayBuffer object contain the TypedArray of a ICO file.
   * @returns {Promise<Object[]>} Resolves to array of parsed ICO.
   *   * `width` **Number** - Image width.
   *   * `height` **Number** - Image height.
   *   * `bit` **Number** - Image bit depth.
   *   * `buffer` **ArrayBuffer** - Image buffer.
   */
  parse (buffer) {
    const icoDv = new DataView(buffer);
    if (icoDv.getUint16(0, true) !== 0 || icoDv.getUint16(2, true) !== 1) {
      throw new Error('buffer is not ico');
    }
    // make single image icon
    let ico, data;
    // let idCount = icoDv.getUint16(4, true);
    const icos = Promise.all(range(icoDv.getUint16(4, true)).map(i => {
      ico = extractOne(buffer, i);
      switch (ico.bit) { // eslint-disable-line default-case
        case 1:
          data = make1bitImageData(ico);
          break;
        case 4:
          data = make4bitImageData(ico);
          break;
        case 8:
          data = make8bitImageData(ico);
          break;
        case 24:
          data = make24bitImageData(ico);
          break;
        case 32:
          data = make32bitImageData(ico);
          break;
      }
      return PNG.encode({
        width: ico.width,
        height: ico.height,
        data
      }).then(pngBuffer => {
        return {
          bit: ico.bit,
          width: ico.width,
          height: ico.height,
          buffer: pngBuffer
        };
      });
    }));
    return icos;
  },
  /**
   * Check the ArrayBuffer is valid ICO.
   * @param {ArrayBuffer} buffer The ArrayBuffer object contain the TypedArray of a ICO file.
   * @returns {Boolean} True if arg is ICO.
   */
  isICO (buffer) {
    if (!(buffer instanceof ArrayBuffer)) {
      return false;
    }
    const icoDv = new DataView(buffer);
    // idReserved = icoDv.getUint16(0, true)
    // idType = icoDv.getUint16(0, true)
    return icoDv.getUint16(0, true) === 0 && icoDv.getUint16(2, true) === 1;
  },
  /**
   * No conflict.
   * @returns {ICO} `ICO` Object.
   */
  noConflict () {
    global.ICO = previousICO;
    return this;
  }
};

module.exports = ICO;
global.ICO = ICO;
