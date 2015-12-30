'use strict';

/**
 * Make number dividable by 4
 * @access private
 * @param {Number} num number
 * @returns {Number} number dividable by 4
 */
const toDividableBy4 = num => {
  if (num % 4 !== 0) {
    num += 4 - num % 4;
  }
  return num;
};

module.exports = toDividableBy4;
