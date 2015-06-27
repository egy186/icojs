/* global global: false */

var extractOne = require('./extractone');
var PNG = require('./png');
var util = require('./util');

/**
 * make 1bit image imageData.data
 * @private
 * @param {Object} ico should have width, height, bit, colors, xor, and
 * @returns {Uint8ClampedArray} imageData.data
 */
var make1bitImageData = function (ico) {
  var color;
  var xor = util.to1bitArray(ico.xor);
  var and = util.to1bitArray(ico.and);
  var xorLine = util.toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
  var andLine = util.toDividableBy4(ico.width / 8) * 8;
  var index = 0;
  var data = new Uint8ClampedArray(ico.width * ico.height * 4);
  for (var h = ico.height - 1; h >= 0; h--) {
    for (var w = 0; w < ico.width; w++) {
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
var make4bitImageData = function (ico) {
  var color;
  var xor = util.to4bitArray(ico.xor);
  var and = util.to1bitArray(ico.and);
  var xorLine = util.toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
  var andLine = util.toDividableBy4(ico.width / 8) * 8;
  var index = 0;
  var data = new Uint8ClampedArray(ico.width * ico.height * 4);
  for (var h = ico.height - 1; h >= 0; h--) {
    for (var w = 0; w < ico.width; w++) {
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
var make8bitImageData = function (ico) {
  var color;
  var xor = new Uint8Array(ico.xor);
  var and = util.to1bitArray(ico.and);
  var xorLine = util.toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
  var andLine = util.toDividableBy4(ico.width / 8) * 8;
  var index = 0;
  var data = new Uint8ClampedArray(ico.width * ico.height * 4);
  index = 0;
  for (var h = ico.height - 1; h >= 0; h--) {
    for (var w = 0; w < ico.width; w++) {
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
var make24bitImageData = function (ico) {
  var xor = new Uint8Array(ico.xor);
  var and = util.to1bitArray(ico.and);
  var xorLine = util.toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
  var andLine = util.toDividableBy4(ico.width / 8) * 8;
  var index = 0;
  var data = new Uint8ClampedArray(ico.width * ico.height * 4);
  for (var h = ico.height - 1; h >= 0; h--) {
    for (var w = 0; w < ico.width; w++) {
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
var make32bitImageData = function (ico) {
  var xor = new Uint8Array(ico.xor);
  var and = util.to1bitArray(ico.and);
  var xorLine = util.toDividableBy4(ico.width * ico.bit / 8) * 8 / ico.bit;
  var andLine = util.toDividableBy4(ico.width / 8) * 8;
  var index = 0;
  var data = new Uint8ClampedArray(ico.width * ico.height * 4);
  for (var h = ico.height - 1; h >= 0; h--) {
    for (var w = 0; w < ico.width; w++) {
      data[index] = xor[(h * xorLine + w) * 4 + 2];
      data[index + 1] = xor[(h * xorLine + w) * 4 + 1];
      data[index + 2] = xor[(h * xorLine + w) * 4];
      data[index + 3] = and[h * andLine + w] === 1 || xor[(h * xorLine + w) * 4 + 3] === 1 ? 0 : xor[(h * xorLine + w) * 4 + 3] > 1 ? xor[(h * xorLine + w) * 4 + 3] : 255;
      index += 4;
    }
  }
  return data;
};

var previousICO = global.ICO;

/**
 * @class ICO
 */
var ICO = {
  /**
   * Parse ICO and return some PNGs.
   * @param {ArrayBuffer} buffer The ArrayBuffer object contain the TypedArray of a ICO file.
   * @returns {Object[]} Array of parsed ICO.
   * * .width <code>Number</code> - Image width.
   * * .height <code>Number</code> - Image height.
   * * .bit <code>Number</code> - Image bit depth.
   * * .buffer <code>ArrayBuffer</code> - Image buffer.
   */
  parse: function (buffer) {
    var icoDv = new DataView(buffer);
    if (icoDv.getUint16(0, true) !== 0 || icoDv.getUint16(2, true) !== 1) {
      throw new Error('buffer is not ico');
    }
    // make single image icon
    var ico, data;
    var icos = [];
    // var idCount = icoDv.getUint16(4, true);
    for (var i = 0; i < icoDv.getUint16(4, true); i++) {
      ico = extractOne(buffer, i);
      switch (ico.bit) {
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
      icos.push({
        bit: ico.bit,
        width: ico.width,
        height: ico.height,
        buffer: PNG.encode({
          width: ico.width,
          height: ico.height,
          data: data
        })
      });
    }
    return icos;
  },
  /**
   * Check the ArrayBuffer is valid ICO.
   * @param {ArrayBuffer} buffer The ArrayBuffer object contain the TypedArray of a ICO file.
   * @returns {Boolean} True if arg is ICO.
   */
  isICO: function (buffer) {
    if (!(buffer instanceof ArrayBuffer)) {
      return false;
    }
    var icoDv = new DataView(buffer);
    // idReserved = icoDv.getUint16(0, true)
    // idType = icoDv.getUint16(0, true)
    return icoDv.getUint16(0, true) === 0 && icoDv.getUint16(2, true) === 1;
  },
  /**
   * No conflict.
   * @returns {ICO}
   */
  noConflict: function () {
    global.ICO = previousICO;
    return this;
  }
};

module.exports = ICO;
global.ICO = ICO;
