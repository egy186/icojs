'use strict';

const createCanvas = global.document ? function (width, height) {
  const canvas = global.document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
} : function (width, height) {
  const Canvas = require('canvas');
  return new Canvas(width, height);
};

const atob = global.atob ? global.atob : function (str) {
  const Buffer = require('buffer').Buffer;
  return new Buffer(str, 'base64').toString('binary');
};

const dataURLToArrayBuffer = function (dataURL) {
  const string = atob(dataURL.replace(/.+,/, ''));
  const bytes = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    bytes[i] = string.charCodeAt(i);
  }
  return bytes.buffer;
};

const PNG = {
  /**
   * create png from imgData.data
   * @param {Object} image data
   * @param {Number} image.width img width
   * @param {Number} image.height img height
   * @param {Uint8ClampedArray} image.data same as imageData.data
   * @returns {ArrayBuffer} png
   */
  encode (image) {
    const data = image.data;
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(image.width, image.height);
    const dataData = imageData.data;
    for (let i = 0; i < dataData.length; i++) {
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
  // decode: function (buffer) {
  // }
};

module.exports = PNG;
