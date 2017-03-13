'use strict';

const bufferToArrayBuffer = buffer => {
  if (Buffer.isBuffer(buffer)) {
    return new Uint8Array(buffer).buffer;
  }
  if (ArrayBuffer.isView(buffer)) {
    return buffer.buffer;
  }
  if (buffer instanceof ArrayBuffer) {
    return buffer;
  }
  return false;
};

module.exports = bufferToArrayBuffer;
