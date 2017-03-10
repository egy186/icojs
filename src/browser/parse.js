'use strict';

const Image = require('./image');
const parseICO = require('../parse-ico');

const parse = (arrayBuffer, mime) => parseICO(arrayBuffer, mime, Image);

module.exports = parse;
