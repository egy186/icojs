'use strict';

const Image = require('../src/node/image');
const bufferToArrayBuffer = require('../src/node/buffer-to-arraybuffer');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const isSame = require('./fixtures/is-same');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('Image', () => {
  describe('.decode', () => {
    it('is expected to create ImageData from PNG', () => {
      const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/1x1/1x1-1bit.png'));
      const arrayBuffer = bufferToArrayBuffer(buffer);
      const promise = Image.decode(arrayBuffer);
      return Promise.all([
        expect(promise).to.eventually.have.property('data').that.is.deep.equal(new Uint8ClampedArray([0, 0, 0, 0])),
        expect(promise).to.eventually.have.property('height').that.is.deep.equal(1),
        expect(promise).to.eventually.have.property('width').that.is.deep.equal(1)
      ]);
    });
  });
  describe('.encode', () => {
    it('is expected to create PNG from ImageData', () => {
      const promise = Image.encode({
        width: 1,
        height: 1,
        data: new Uint8ClampedArray([0, 0, 0, 0])
      });
      return Promise.all([
        expect(promise).to.eventually.instanceof(ArrayBuffer),
        expect(promise.then(ab => isSame(ab, '1x1/1x1-1bit.png'))).to.become(true)
      ]);
    });
  });
});
