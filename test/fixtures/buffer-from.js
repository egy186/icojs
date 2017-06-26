'use strict';

const bufferFrom = (arrayBuffer, byteOffset, length) => {
  if (Buffer.from === Uint8Array.from) { // Node <4.5
    // eslint-disable-next-line no-buffer-constructor, node/no-deprecated-api
    return new Buffer(arrayBuffer, byteOffset, length);
  }
  return Buffer.from(arrayBuffer, byteOffset, length);
};

module.exports = bufferFrom;
