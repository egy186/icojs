'use strict';

const fs = require('fs');
const path = require('path');

const file = 'basic';
const fileBuffer = fs.readFileSync(path.resolve(__dirname, file + '.ico'));

module.exports = {
  buffer: fileBuffer,
  arrayBuffer: new Uint8Array(fileBuffer).buffer,
  expected: require('./' + file),
  bufferToBase64 (buffer) {
    if (buffer instanceof ArrayBuffer) {
      buffer = new Buffer(new Uint8Array(buffer));
    }
    return buffer.toString('base64');
  }
};
