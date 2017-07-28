'use strict';

const Buffer = require('safe-buffer').Buffer;
const Jimp = require('jimp');
const path = require('path');

const isSame = (arrayBuffer, fileName) => Promise.all([
  Jimp.read(Buffer.from(arrayBuffer)),
  Jimp.read(path.join(__dirname, 'images', fileName))
]).then(images => {
  const diff = Jimp.diff(images[0], images[1], 0).percent;
  return diff === 0;
});

module.exports = isSame;
