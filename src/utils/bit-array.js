'use strict';

const bitArray = {
  /**
   * convert ArrayBuffer to 1bit Array
   * @access private
   * @param {ArrayBuffer} buffer buffer
   * @returns {Array} bits array
   */
  of1 (buffer) {
    const buff = new Uint8Array(buffer);
    let bit = '';
    for (let i = 0; i < buff.byteLength; i++) {
      bit += `000000000${buff[i].toString(2)}`.slice(-8);
    }
    return bit.split('').map(el => parseInt(el, 2));
  },
  /**
   * convert ArrayBuffer to 4bit Array
   * @access private
   * @param {ArrayBuffer} buffer buffer
   * @returns {Array} bits array
   */
  of4 (buffer) {
    const buff = new Uint8Array(buffer);
    let bit = '';
    for (let i = 0; i < buff.byteLength; i++) {
      bit += `00${buff[i].toString(16)}`.slice(-2);
    }
    return bit.split('').map(el => parseInt(el, 16));
  },
  /**
   * convert ArrayBuffer to 8bit Array
   * @access private
   * @param {ArrayBuffer} buffer buffer
   * @returns {Array} bits array
   */
  of8 (buffer) {
    const buff = new Uint8Array(buffer);
    const bit = [];
    for (let i = 0; i < buff.byteLength; i++) {
      bit.push(buff[i]);
    }
    return bit;
  }
};

module.exports = bitArray;
