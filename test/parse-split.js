'use strict';

const Image = require('../src/node/image');
const bufferToArrayBuffer = require('../src/node/buffer-to-arraybuffer');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const split = require('../src/parse/split');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('parse/split', () => {
  it('is expected to throw when arg is not ArrayBuffer', () => {
    const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/basic.ico'));
    expect(() => split(buffer, null, Image)).to.throw(TypeError);
  });
  it('is expected to return an array of IconImageData', () => {
    const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/basic.ico'));
    const arrayBuffer = bufferToArrayBuffer(buffer);
    const icons = split(arrayBuffer, null, Image);
    icons.forEach(iconImageData => {
      expect(iconImageData.height).to.be.a('number');
      expect(iconImageData.iconImage).to.be.instanceof(ArrayBuffer);
      expect(iconImageData.width).to.be.a('number');
    });
  });
});
