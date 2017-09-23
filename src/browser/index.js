'use strict';


const Image = require('./image');
const isICO = require('../is-ico');
const parseICO = require('../parse-ico');

const globalICO = global.ICO;

const parse = (arrayBuffer, mime) => parseICO(arrayBuffer, mime, Image);

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
