'use strict';

const { MIME_PNG } = require('../mime');

const dataURLToArrayBuffer = dataURL => {
  const string = atob(dataURL.replace(/.+,/u, ''));
  const view = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    view[i] = string.charCodeAt(i);
  }
  return view.buffer;
};

const Image = {
  /**
   * Create imageData from image.
   *
   * @access private
   * @param {ArrayBuffer} arrayBuffer - Image buffer.
   * @returns {ImageData} ImageData.
   */
  decode (arrayBuffer) {
    return new Promise(resolve => {
      // eslint-disable-next-line node/no-unsupported-features/node-builtins
      const url = URL.createObjectURL(new Blob([arrayBuffer]));
      const img = document.createElement('img');
      img.src = url;
      img.onload = () => {
        const { naturalHeight: height, naturalWidth: width } = img;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, width, height);
        resolve({
          data,
          height,
          width
        });
      };
    });
  },
  /**
   * Create image from imgData.data.
   *
   * @access private
   * @param {object} image - Data.
   * @param {number} image.width - Image width.
   * @param {number} image.height - Image height.
   * @param {Uint8ClampedArray} image.data - Same as imageData.data.
   * @param {string} [mime=image/png] - MIME type.
   * @returns {ArrayBuffer} Image.
   */
  encode (image, mime = MIME_PNG) {
    return new Promise(resolve => {
      const { data, height, width } = image;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(width, height);
      const dataData = imageData.data;
      for (let i = 0; i < dataData.length; i++) {
        dataData[i] = data[i];
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(dataURLToArrayBuffer(canvas.toDataURL(mime)));
    });
  }
};

module.exports = Image;
