(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/* jshint node: true */

'use strict';

var extractOne = require('./extractone');
var PNG = require('./png');
var util = require('./util');

/**
 * make 1bit image imageData.data
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
      data[index + 3] = (and[h * andLine + w] === 1 || xor[(h * xorLine + w) * 4 + 3] === 1) ? 0 : (xor[(h * xorLine + w) * 4 + 3] > 1 ? xor[(h * xorLine + w) * 4 + 3] : 255);
      index += 4;
    }
  }
  return data;
};

var previousICO = global.ICO;

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
   * no conflict
   */
  noConflict: function() {
    global.ICO = previousICO;
    return this;
  }
};

module.exports = ICO;
global.ICO = ICO;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./extractone":2,"./png":3,"./util":4}],2:[function(require,module,exports){
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
  var icoWidth = dv.getUint8(6 + index * 16) || 256;
  var icoHeight = dv.getUint8(7 + index * 16) || 256;
  var icoOffset = dv.getUint32(18 + index * 16, true);
  var icoBit = dv.getUint16(icoOffset + 14, true);
  var icoColorsOffset = dv.getUint32(18 + index * 16, true) + dv.getUint32(icoOffset, true);
  var icoColorsCount = dv.getUint32(icoOffset + 32, true);
  var icoXorOffset = icoColorsOffset + icoColorsCount * 4;
  var icoAndOffset = icoXorOffset + util.toDividableBy4(icoWidth * icoBit / 8) * icoHeight;

  var ico = {
    width: icoWidth,
    height: icoHeight,
    colorCount: dv.getUint8(8 + index * 16),
    bit: icoBit,
    colors: [],
    xor: buffer.slice(icoXorOffset, icoAndOffset),
    and: buffer.slice(icoAndOffset, icoAndOffset + util.toDividableBy4(icoWidth / 8) * icoHeight)
  };
  for (var i = 0; i < icoColorsCount; i++) {
    ico.colors.push(util.to8bitArray(buffer.slice(icoColorsOffset + i * 4, icoColorsOffset + i * 4 + 4)));
  }

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
  },
  /**
   * Make number dividable by 4
   * @param {Number} num number
   * @returns {Number} number dividable by 4
   */
  toDividableBy4: function (num) {
    if (num % 4 !== 0) {
      num += 4 - num % 4;
    }
    return num;
  }
};

module.exports = util;

},{}]},{},[1]);
