'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

const PNG = require('../src/png');

const isSame = require('./fixtures/is-same');

describe('PNG', () => {
  describe('.encode', () => {
    it('is expected to be a function', () => {
      expect(PNG.encode).to.be.a('function');
    });
    it('is expected to create png from imageData.data', () => {
      const promise = PNG.encode({
        width: 1,
        height: 1,
        data: new Uint8ClampedArray([0, 0, 0, 0])
      }).then(ab => {
        expect(ab instanceof ArrayBuffer).to.be.true;
        return isSame(ab, '1x1/1x1-1bit.png');
      });
      return expect(promise).to.become(true);
    });
  });
});
