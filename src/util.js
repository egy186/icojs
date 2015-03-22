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
