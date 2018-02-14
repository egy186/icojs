'use strict';

const Image = require('../../src/node/image');
const chai = require('chai');
const fileType = require('file-type');
const fs = require('fs');
const isSame = require('../fixtures/is-same');
const path = require('path');

const expect = chai.expect;

describe('Image', () => {
  describe('.decodeSync', () => {
    it('is expected to throw error when mime is not supported', () => {
      const arrayBuffer = new ArrayBuffer(100);
      expect(() => Image.decodeSync(arrayBuffer)).to.throw(TypeError);
    });
    it('is expected to create ImageData from PNG', () => {
      const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/images/1x1/1x1-1bit.png'));
      const imageData = Image.decodeSync(buffer);
      expect(imageData.data).to.deep.equal(new Uint8ClampedArray([0, 0, 0, 0]));
      expect(imageData.height).to.deep.equal(1);
      expect(imageData.width).to.deep.equal(1);
    });
  });
  describe('.encodeSync', () => {
    it('is expected to create 1x1 PNG from ImageData', () => {
      const imageArrayBuffer = Image.encodeSync({
        width: 1,
        height: 1,
        data: new Uint8ClampedArray([0, 0, 0, 0])
      });
      expect(imageArrayBuffer).to.be.an.instanceof(ArrayBuffer);
      expect(fileType(imageArrayBuffer).mime).to.deep.equal('image/png');
      expect(isSame(imageArrayBuffer, '1x1/1x1-1bit.png')).to.be.true;
    });
    const mimeTypes = [
      'image/bmp',
      'image/jpeg',
      'image/png'
    ];
    mimeTypes.forEach(mime => {
      it(`is expected to create ${mime} from ImageData`, () => {
        const imageArrayBuffer = Image.encodeSync({
          width: 1,
          height: 1,
          data: new Uint8ClampedArray([0, 0, 0, 0])
        }, mime);
        expect(fileType(imageArrayBuffer).mime).to.deep.equal(mime);
      });
    });
  });
});
