'use strict';

const Image = require('../src/node/image');
const basic = require('./fixtures/images/basic');
const chai = require('chai');
const getImageData = require('../src/get-image-data');
const isSame = require('./fixtures/is-same');

const expect = chai.expect;

describe('getImageData', () => {
  basic.forEach(bmpObject => {
    it('is expected to create ImageData', () => {
      const imageData = getImageData(bmpObject);
      const arrayBuffer = Image.encodeSync(imageData);
      const expected = `basic/${bmpObject.width}x${bmpObject.height}-${bmpObject.bit}bit.png`;
      expect(isSame(arrayBuffer, expected)).to.be.true;
      expect(imageData.data).to.be.instanceof(Uint8ClampedArray);
      expect(imageData.height).to.deep.equal(bmpObject.height);
      expect(imageData.width).to.deep.equal(bmpObject.width);
    });
  });
});
