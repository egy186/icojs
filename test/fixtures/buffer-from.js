'use strict';

const bufferFrom = (arrayBuffer, byteOffset, length) => {
  if (Buffer.from === Uint8Array.from) { // Node <4.5
    return new Buffer(arrayBuffer, byteOffset, length);
  }
  return Buffer.from(arrayBuffer, byteOffset, length);
};

module.exports = bufferFrom;
