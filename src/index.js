'use strict';

const PNG = require('./png');
const extractOne = require('./extract-one');
const imageData = require('./image-data');

const range = n => new Array(n).fill(0).map((_, i) => i);

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
      return Promise.reject(new Error('buffer is not ico'));
    }
    // make single image icon
    // let idCount = icoDv.getUint16(4, true);
    const icos = Promise.all(range(icoDv.getUint16(4, true)).map(i => {
      let data;
      const ico = extractOne(buffer, i);
      switch (ico.bit) { // eslint-disable-line default-case
        case 1:
          data = imageData.from1bit(ico);
          break;
        case 4:
          data = imageData.from4bit(ico);
          break;
        case 8:
          data = imageData.from8bit(ico);
          break;
        case 24:
          data = imageData.from24bit(ico);
          break;
        case 32:
          data = imageData.from32bit(ico);
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
  }
  /**
   * No conflict. (Browser only)
   * @returns {ICO} `ICO` Object.
   */
};

module.exports = ICO;
