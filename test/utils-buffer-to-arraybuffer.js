'use strict';

const chai = require('chai');

const expect = chai.expect;

const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');

describe('bufferToArrayBuffer', () => {
  it('is expected be a function', () => {
    expect(bufferToArrayBuffer).to.be.a('function');
  });
  it('is expected to create ArrayBuffer from Buffer', () => {
    const length = 100;
    const ab = bufferToArrayBuffer(new Buffer(length));
    expect(ab instanceof ArrayBuffer).to.be.true;
    expect(ab.byteLength).to.deep.equal(length);
  });
});
