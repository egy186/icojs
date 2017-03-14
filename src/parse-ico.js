'use strict';

const bufferToArrayBuffer = require('./utils/buffer-to-arraybuffer');
const bitDepthOfPNG = require('./bit-depth-of-png');
const isCUR = require('./is-cur');
const isICO = require('./is-ico');
const isPNG = require('./is-png');
const parseBMP = require('./parse-bmp');
const range = require('./utils/range');

/**
 * Parse ICO and return some image object.
 * @access private
 * @param {ArrayBuffer|Buffer} buffer ICO file data.
 * @param {String} mime MIME type for output.
 * @param {Object} Image Image encoder/decoder
 * @returns {Promise<Object[]>} Resolves to array of parsed ICO.
 *   * `width` **Number** - Image width.
 *   * `height` **Number** - Image height.
 *   * `bit` **Number** - Image bit depth.
 *   * `buffer` **ArrayBuffer** - Image buffer.
 */
const parseICO = (buffer, mime, Image) => {
  const arrayBuffer = bufferToArrayBuffer(buffer);
  if (!arrayBuffer) {
    return Promise.reject(new TypeError('"buffer" argument must be a Buffer or ArrayBuffer'));
  }
  if (!isCUR(arrayBuffer) && !isICO(arrayBuffer)) {
    return Promise.reject(new Error('buffer is not ico'));
  }
  const dataView = new DataView(arrayBuffer);

  const count = dataView.getUint16(4, true);
  const infoHeaders = range(count)
    .map(index => {
      const length = 16;
      const offset = 6 + (index * length);
      return arrayBuffer.slice(offset, offset + length);
    });
  const iconImages = range(count)
    .map(index => {
      const infoHeader = new DataView(infoHeaders[index]);
      const length = infoHeader.getUint32(8, true);
      const offset = infoHeader.getUint32(12, true);
      return arrayBuffer.slice(offset, offset + length);
    });
  const parseIconImage = (width, height, iconImage) => {
    if (isPNG(iconImage)) {
      const bit = bitDepthOfPNG(iconImage);
      return Image.decode(iconImage).then(imageData => Object.assign(imageData, { bit }));
    }
    return Promise.resolve(parseBMP(width, height, iconImage));
  };
  const icos = range(count)
    .map(index => {
      const infoHeader = new DataView(infoHeaders[index]);
      const width = infoHeader.getUint8(0) || 256;
      const height = infoHeader.getUint8(1) || 256;
      return parseIconImage(width, height, iconImages[index])
        .then(imageData => {
          if (isCUR(arrayBuffer)) {
            imageData.hotspot = {
              x: infoHeader.getUint16(4, true),
              y: infoHeader.getUint16(6, true)
            };
          }
          return Image.encode(imageData, mime)
            .then(imageBuffer => {
              const image = Object.assign({ buffer: imageBuffer }, imageData);
              delete image.data;
              return image;
            });
        });
    });
  return Promise.all(icos);
};

module.exports = parseICO;
