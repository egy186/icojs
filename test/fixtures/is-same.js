'use strict';

const Image = require('../../src/node/image');
const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');

const isSame = (arrayBuffer, fileName) => {
  const img1 = Image.decodeSync(arrayBuffer);
  const arrayBuffer2 = fs.readFileSync(path.join(__dirname, 'images', fileName));
  const img2 = Image.decodeSync(arrayBuffer2);
  const diff = pixelmatch(img1.data, img2.data, null, img1.width, img1.height, {
    includeAA: true,
    threshold: 0
  });
  return diff === 0;
};

module.exports = isSame;
