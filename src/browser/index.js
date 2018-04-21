'use strict';

const Image = require('./image');
const isICO = require('../is-ico');
const parseICO = require('../parse');

const parse = (arrayBuffer, mime) => parseICO(arrayBuffer, mime || 'image/png', Image);

const ICO = {
  isICO,
  parse
};

module.exports = ICO;
