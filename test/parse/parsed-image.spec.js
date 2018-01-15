'use strict';

const chai = require('chai');
const parsedImage = require('../../src/parse/parsed-image');

const expect = chai.expect;

describe('parsedImage', () => {
  it('is expected to return ParsedImage', () => {
    const imageData = {
      bit: Symbol('BIT_DEPTH'),
      data: Symbol('IMAGE_DATA_DATA'),
      height: Symbol('ICON_HEIGHT'),
      width: Symbol('ICON_WIDTH')
    };
    const imageBuffer = Symbol('IMAGE_BUFFER');
    const hotspot = Symbol('ICON_HOTSPOT');
    const image = parsedImage(imageData, imageBuffer, hotspot);
    expect(image.bit).to.deep.equal(imageData.bit);
    expect(image.buffer).to.deep.equal(imageBuffer);
    expect(image.height).to.deep.equal(imageData.height);
    expect(image.hotspot).to.deep.equal(hotspot);
    expect(image.width).to.deep.equal(imageData.width);
  });
});
