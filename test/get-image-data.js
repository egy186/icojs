'use strict';

const Image = require('../src/image');
const basic = require('./fixtures/images/basic');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const getImageData = require('../src/get-image-data');
const isSame = require('./fixtures/is-same');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('getImageData', () => {
  basic.forEach(bmpObject => {
    it('is expected to create ImageData', () => {
      const imageData = getImageData(bmpObject);
      const promise = Image.encode(imageData).then(arrayBuffer => {
        const expected = `basic/${bmpObject.width}x${bmpObject.height}-${bmpObject.bit}bit.png`;
        return isSame(arrayBuffer, expected);
      });
      expect(imageData.data).to.be.instanceof(Uint8ClampedArray);
      expect(imageData.height).to.deep.equal(bmpObject.height);
      expect(imageData.width).to.deep.equal(bmpObject.width);
      return expect(promise).to.become(true);
    });
  });
});
