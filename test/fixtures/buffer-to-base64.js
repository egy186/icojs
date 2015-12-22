'use strict';

const bufferToBase64 = buffer => {
  if (buffer instanceof ArrayBuffer) {
    buffer = new Buffer(buffer);
  }
  return buffer.toString('base64');
};

module.exports = bufferToBase64;
