'use strict';

const bufferToBase64 = buffer => new Buffer(buffer).toString('base64');

module.exports = bufferToBase64;
