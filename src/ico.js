/* jshint node: true */

'use strict';

var extractOne = require('./extractOne');
var util = require('./util');
var PNG = require('./png');

var previousIco = global.ICO;

var ICO = {
  /**
   * check buffer is valid ico
   * @param {ArrayBuffer} buffer
   * @returns {Boolean} true if valid
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
   * parse ico file
   * @param {ArrayBuffer} buffer ico buffer
   * @returns {Object[]} ico Array of parsed ico
   * @returns {Number} ico[].bit bit depth
   * @returns {Number} ico[].width image width
   * @returns {Number} ico[].height image height
   * @returns {String} ico[].type image mime-type
   * @returns {ArrayBuffer} ico[].buffer image buffer
   */
  parse: function (buffer) {
    var icoDv = new DataView(buffer);
    if (icoDv.getUint16(0, true) !== 0 || icoDv.getUint16(2, true) !== 1) {
      throw new Error('buffer is not ico');
    }
    var i, j, k, index;
    // make single image icon
    var ico, color, xorLine, andLine;
    var data;
    var icos = [];
    // var idCount = icoDv.getUint16(4, true);
    for (i = 0; i < icoDv.getUint16(4, true); i++) {
      ico = extractOne(buffer, i);
      ico.and = util.to1bitArray(ico.and);
      xorLine = ico.width * ico.bit / 8;
      if (xorLine % 4 !== 0) {
        xorLine += 4 - xorLine % 4;
      }
      xorLine *= 8 / ico.bit;
      andLine = ico.width / 8;
      if (andLine % 4 !== 0) {
        andLine += 4 - andLine % 4;
      }
      andLine *= 8;

      data = new Uint8ClampedArray(ico.width * ico.height * 4);
      switch (ico.bit) {
        case 1:
          ico.xor = util.to1bitArray(ico.xor);
          index = 0;
          for (j = ico.height - 1; j >= 0; j--) {
            for (k = 0; k < ico.width; k++) {
              color = ico.colors[ico.xor[j * xorLine + k]];
              data[index * 4] = color[2];
              data[index * 4 + 1] = color[1];
              data[index * 4 + 2] = color[0];
              data[index * 4 + 3] = ico.and[j * andLine + k] ? 0 : 255;
              index++;
            }
          }
          break;
        case 4:
          ico.xor = util.to4bitArray(ico.xor);
          index = 0;
          for (j = ico.height - 1; j >= 0; j--) {
            for (k = 0; k < ico.width; k++) {
              color = ico.colors[ico.xor[j * xorLine + k]];
              data[index * 4] = color[2];
              data[index * 4 + 1] = color[1];
              data[index * 4 + 2] = color[0];
              data[index * 4 + 3] = ico.and[j * andLine + k] ? 0 : 255;
              index++;
            }
          }
          break;
        case 8:
          ico.xor = util.to8bitArray(ico.xor);
          index = 0;
          for (j = ico.height - 1; j >= 0; j--) {
            for (k = 0; k < ico.width; k++) {
              color = ico.colors[ico.xor[j * xorLine + k]];
              data[index * 4] = color[2];
              data[index * 4 + 1] = color[1];
              data[index * 4 + 2] = color[0];
              data[index * 4 + 3] = ico.and[j * andLine + k] ? 0 : 255;
              index++;
            }
          }
          break;
        case 24:
          ico.xor = util.to8bitArray(ico.xor);
          index = 0;
          for (j = ico.height - 1; j >= 0; j--) {
            for (k = 0; k < ico.width; k++) {
              data[index * 4] = ico.xor[(j * xorLine + k) * 3 + 2];
              data[index * 4 + 1] = ico.xor[(j * xorLine + k) * 3 + 1];
              data[index * 4 + 2] = ico.xor[(j * xorLine + k) * 3];
              data[index * 4 + 3] = ico.and[j * andLine + k] ? 0 : 255;
              index++;
            }
          }
          break;
        case 32:
          ico.xor = util.to8bitArray(ico.xor);
          index = 0;
          for (j = ico.height - 1; j >= 0; j--) {
            for (k = 0; k < ico.width; k++) {
              data[index * 4] = ico.xor[(j * xorLine + k) * 4 + 2];
              data[index * 4 + 1] = ico.xor[(j * xorLine + k) * 4 + 1];
              data[index * 4 + 2] = ico.xor[(j * xorLine + k) * 4];
              data[index * 4 + 3] = (ico.and[j * andLine + k] === 1 || ico.xor[(j * xorLine + k) * 4 + 3] === 1) ? 0 : (ico.xor[(j * xorLine + k) * 4 + 3] > 1 ? ico.xor[(j * xorLine + k) * 4 + 3] : 255);
              index++;
            }
          }
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
   * no conflict
   */
  noConflict: function() {
    global.ICO = previousIco;
    return this;
  }
};

module.exports = ICO;
global.ICO = ICO;
