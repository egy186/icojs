(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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
  isIco: function (buffer) {
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
   * @returns {Number} ico.bit bit depth
   * @returns {Number} ico.width image width
   * @returns {Number} ico.height image height
   * @returns {String} ico.type image mime-type
   * @returns {ArrayBuffer} ico.buffer image buffer
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./extractOne":2,"./png":3,"./util":4}],2:[function(require,module,exports){
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

},{"./util":4}],3:[function(require,module,exports){
(function (global){
/* jshint node: true */

'use strict';

/* istanbul ignore next */
var createCanvas = global.document ? function (width, height) {
  var canvas = global.document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
} : function (width, height) {
  var Canvas = require('canvas');
  return new Canvas(width, height);
};

/* istanbul ignore next */
/* jshint -W079 */
var atob = global.atob ? global.atob : function (str) {
/* jshint +W079 */
  var Buffer = require('buffer').Buffer;
  return new Buffer(str, 'base64').toString('binary');
};

var dataURLToArrayBuffer = function (dataURL) {
  var string =  atob(dataURL.replace(/.+,/, ''));
  var bytes = new Uint8Array(string.length);
  for (var i = 0; i < string.length; i++) {
    bytes[i] = string.charCodeAt(i);
  }
  return bytes.buffer;
};

var PNG = {
  /**
   * create png from imgData.data
   * @param {Object} data
   * @param {Number} image.width img width
   * @param {Number} image.height img height
   * @param {Uint8ClampedArray} image.data same as imageData.data
   * @returns {ArrayBuffer} png
   */
  encode: function (image) {
    var data = image.data;
    var canvas = createCanvas(image.width, image.height);
    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(image.width, image.height);
    var dataData = imageData.data;
    for (var i = 0; i < dataData.length; i++) {
      dataData[i] = data[i];
    }
    ctx.putImageData(imageData, 0, 0);
    return dataURLToArrayBuffer(canvas.toDataURL());
  },
  /**
   * create imgData.data from png
   * @param {ArrayBuffer} buffer png
   * @returns {Object} data
   * @returns {Number} image.width
   * @returns {Number} image.height
   * @returns {Uint8ClampedArray} image.data
   */
  /*decode: function (buffer) {
  }*/
};

module.exports = PNG;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer":undefined,"canvas":undefined}],4:[function(require,module,exports){
/* jshint node: true */

'use strict';

var util = {
  /**
   * convert ArrayBuffer to 1bit Array
   * @param {ArrayBuffer} buffer
   * @returns {Array}
   */
  to1bitArray: function (buffer) {
    var buff = new Uint8Array(buffer);
    var bit = '';
    for (var i = 0; i < buff.byteLength; i++) {
      bit += ('000000000' + buff[i].toString(2)).slice(-8);
    }
    return bit.split('').map(function (el) {
      return parseInt(el, 2);
    });
  },
  /**
   * convert ArrayBuffer to 4bit Array
   * @param {ArrayBuffer} buffer
   * @returns {Array}
   */
  to4bitArray: function (buffer) {
    var buff = new Uint8Array(buffer);
    var bit = '';
    for (var i = 0; i < buff.byteLength; i++) {
      bit += ('00' + buff[i].toString(16)).slice(-2);
    }
    return bit.split('').map(function (el) {
      return parseInt(el, 16);
    });
  },
  /**
   * convert ArrayBuffer to 8bit Array
   * @param {ArrayBuffer} buffer
   * @returns {Array}
   */
  to8bitArray: function (buffer) {
    var buff = new Uint8Array(buffer);
    var bit = [];
    for (var i = 0; i < buff.byteLength; i++) {
      bit.push(buff[i]);
    }
    return bit;
  }
};

module.exports = util;

},{}]},{},[1]);
