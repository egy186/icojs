'use strict';

const bitArray = require('../../src/utils/bit-array');
const chai = require('chai');

const expect = chai.expect;

describe('utils/bitArray', () => {
  describe('.of1', () => {
    it('is expected to return 1 bit array', () => {
      expect(bitArray.of1(new Uint8Array([0]).buffer)).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
      expect(bitArray.of1(new Uint8Array([1]).buffer)).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 1]);
      expect(bitArray.of1(new Uint8Array([2]).buffer)).to.deep.equal([0, 0, 0, 0, 0, 0, 1, 0]);
      expect(bitArray.of1(new Uint8Array([3]).buffer)).to.deep.equal([0, 0, 0, 0, 0, 0, 1, 1]);
      expect(bitArray.of1(new Uint8Array([255]).buffer)).to.deep.equal([1, 1, 1, 1, 1, 1, 1, 1]);
      expect(bitArray.of1(new Uint8Array([1, 64, 8, 16, 4, 32, 2, 128]).buffer)).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0]);
    });
  });
  describe('.of4', () => {
    it('is expected to return 4 bit array', () => {
      expect(bitArray.of4(new Uint8Array([0]).buffer)).to.deep.equal([0, 0]);
      expect(bitArray.of4(new Uint8Array([1]).buffer)).to.deep.equal([0, 1]);
      expect(bitArray.of4(new Uint8Array([15]).buffer)).to.deep.equal([0, 15]);
      expect(bitArray.of4(new Uint8Array([16]).buffer)).to.deep.equal([1, 0]);
      expect(bitArray.of4(new Uint8Array([17]).buffer)).to.deep.equal([1, 1]);
      expect(bitArray.of4(new Uint8Array([255]).buffer)).to.deep.equal([15, 15]);
      expect(bitArray.of4(new Uint8Array([1, 64, 8, 16, 4, 32, 2, 128]).buffer)).to.deep.equal([0, 1, 4, 0, 0, 8, 1, 0, 0, 4, 2, 0, 0, 2, 8, 0]);
    });
  });
  describe('.of8', () => {
    it('is expected to return 8 bit array', () => {
      expect(bitArray.of8(new Uint8Array([0]).buffer)).to.deep.equal([0]);
      expect(bitArray.of8(new Uint8Array([1]).buffer)).to.deep.equal([1]);
      expect(bitArray.of8(new Uint8Array([2]).buffer)).to.deep.equal([2]);
      expect(bitArray.of8(new Uint8Array([3]).buffer)).to.deep.equal([3]);
      expect(bitArray.of8(new Uint8Array([255]).buffer)).to.deep.equal([255]);
      expect(bitArray.of8(new Uint8Array([1, 64, 8, 16, 4, 32, 2, 128]).buffer)).to.deep.equal([1, 64, 8, 16, 4, 32, 2, 128]);
    });
  });
});
