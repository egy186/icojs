'use strict';

const Jimp = require('jimp');
const bufferFrom = require('./buffer-from');
const path = require('path');

const isSame = (arrayBuffer, fileName) => Promise.all([
  Jimp.read(bufferFrom(arrayBuffer)),
  Jimp.read(path.join(__dirname, 'images', fileName))
]).then(images => {
  const diff = Jimp.diff(images[0], images[1], 0).percent;
  return diff === 0;
});

module.exports = isSame;
