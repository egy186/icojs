/* jshint node: true */

'use strict';

var fs = require('fs');
var path = require('path');

var file = 'basic';
var fileBuffer = fs.readFileSync(path.resolve(__dirname, file + '.ico'));

module.exports = {
  buffer: fileBuffer,
  arrayBuffer: new Uint8Array(fileBuffer).buffer,
  expected: require('./' + file),
  bufferToBase64: function (buffer) {
    if (buffer instanceof ArrayBuffer) {
      buffer = new Buffer(new Uint8Array(buffer));
    }
    return buffer.toString('base64');
  }
};
