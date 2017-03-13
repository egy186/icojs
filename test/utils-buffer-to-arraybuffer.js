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
  it('is expected to create ArrayBuffer from TypedArray', () => {
    const length = 100;
    const ab = bufferToArrayBuffer(new Uint8Array(length));
    expect(ab instanceof ArrayBuffer).to.be.true;
    expect(ab.byteLength).to.deep.equal(length);
  });
  it('is expected to return ArrayBuffer', () => {
    const length = 100;
    const ab = bufferToArrayBuffer(new ArrayBuffer(length));
    expect(ab instanceof ArrayBuffer).to.be.true;
    expect(ab.byteLength).to.deep.equal(length);
  });
  it('is expected to return false', () => {
    expect(bufferToArrayBuffer()).to.be.false;
    expect(bufferToArrayBuffer([])).to.be.false;
    expect(bufferToArrayBuffer({})).to.be.false;
    expect(bufferToArrayBuffer(null)).to.be.false;
    expect(bufferToArrayBuffer(undefined)).to.be.false;
    expect(bufferToArrayBuffer(100)).to.be.false;
    expect(bufferToArrayBuffer('string')).to.be.false;
  });
});
