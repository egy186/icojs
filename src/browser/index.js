'use strict';


const isICO = require('./is-ico');
const parse = require('./parse');

const globalICO = global.ICO;

const ICO = {
  isICO,
  /**
   * No conflict.
   * @memberof ICO
   * @returns {ICO} `ICO` Object.
   */
  noConflict () {
    global.ICO = globalICO;
    return this;
  },
  parse
};

module.exports = ICO;
