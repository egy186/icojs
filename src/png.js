/* global global: false */

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
  var string = atob(dataURL.replace(/.+,/, ''));
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
  }
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
