'use strict';

const Jimp = require('jimp');

const bufferToArrayBuffer = buffer => {
  const ab = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
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
    const jimp = new Jimp(image.width, image.height);
    jimp.scan(0, 0, jimp.bitmap.width, jimp.bitmap.height, function (x, y, idx) {
      this.bitmap.data[idx + 0] = data[idx + 0]; // eslint-disable-line no-invalid-this
      this.bitmap.data[idx + 1] = data[idx + 1]; // eslint-disable-line no-invalid-this
      this.bitmap.data[idx + 2] = data[idx + 2]; // eslint-disable-line no-invalid-this
      this.bitmap.data[idx + 3] = data[idx + 3]; // eslint-disable-line no-invalid-this
    });
    return new Promise((resolve, reject) => {
      jimp.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(bufferToArrayBuffer(buffer));
        }
      });
    });
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
