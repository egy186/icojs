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

describe('parse PNG-compressed icon', () => {
  const file = 'png';
  it(`is expected to parse ${file}.ico`, () => {
    const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images', `${file}.ico`));
    const data = bufferToArrayBuffer(buffer);
    const promise = ICO.parse(data).then(images => {
      expect(images).to.be.a('array');
      return Promise.all(images.map(image => {
        expect(image).to.be.a('object');
        expect(image.buffer instanceof ArrayBuffer).to.be.true;
        return isSame(image.buffer, `${file}/${image.width}x${image.height}-${image.bit}bit.png`);
      }));
    });
    return expect(promise).eventually.not.to.include(false);
  });
});
