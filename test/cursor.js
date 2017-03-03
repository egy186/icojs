'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

const ICO = require('../src/index');
const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');

const isSame = require('./fixtures/is-same');

describe('parse cur', () => {
  const cur = 'cursor';
  const expected = require('./fixtures/images/cursor'); // eslint-disable-line global-require
  it(`is expected to parse ${cur}.cur`, () => {
    const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images', `${cur}.cur`));
    const data = bufferToArrayBuffer(buffer);
    const promise = ICO.parse(data).then(images => {
      expect(images).to.be.a('array');
      return Promise.all(images.map((image, index) => {
        expect(image).to.be.a('object');
        expect(image.buffer instanceof ArrayBuffer).to.be.true;
        expect(image.hotspot).to.deep.equal(expected[index].hotspot);
        return isSame(image.buffer, `${cur}/${image.width}x${image.height}-${image.bit}bit.png`);
      }));
    });
    return expect(promise).eventually.not.to.include(false);
  });
});
