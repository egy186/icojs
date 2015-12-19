'use strict';

const util = {
  /**
   * convert ArrayBuffer to 1bit Array
   * @param {ArrayBuffer} buffer buffer
   * @returns {Array} bits array
   */
  to1bitArray (buffer) {
    const buff = new Uint8Array(buffer);
    let bit = '';
    for (let i = 0; i < buff.byteLength; i++) {
      bit += ('000000000' + buff[i].toString(2)).slice(-8);
    }
    return bit.split('').map(el => {
      return parseInt(el, 2);
    });
  },
  /**
   * convert ArrayBuffer to 4bit Array
   * @param {ArrayBuffer} buffer buffer
   * @returns {Array} bits array
   */
  to4bitArray (buffer) {
    const buff = new Uint8Array(buffer);
    let bit = '';
    for (let i = 0; i < buff.byteLength; i++) {
      bit += ('00' + buff[i].toString(16)).slice(-2);
    }
    return bit.split('').map(el => {
      return parseInt(el, 16);
    });
  },
  /**
   * convert ArrayBuffer to 8bit Array
   * @param {ArrayBuffer} buffer buffer
   * @returns {Array} bits array
   */
  to8bitArray (buffer) {
    const buff = new Uint8Array(buffer);
    const bit = [];
    for (let i = 0; i < buff.byteLength; i++) {
      bit.push(buff[i]);
    }
    return bit;
  },
  /**
   * Make number dividable by 4
   * @param {Number} num number
   * @returns {Number} number dividable by 4
   */
  toDividableBy4 (num) {
    if (num % 4 !== 0) {
      num += 4 - num % 4;
    }
    return num;
  }
};

module.exports = util;
