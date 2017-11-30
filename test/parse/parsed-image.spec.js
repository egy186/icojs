'use strict';

const chai = require('chai');
const parsedImage = require('../../src/parse/parsed-image');

const expect = chai.expect;

describe('parsedImage', () => {
  it('is expected to return ParsedImage', () => {
    const iconImageData = {
      height: Symbol('ICON_HEIGHT'),
      hotspot: Symbol('ICON_HOTSPOT'),
      iconImage: Symbol('ICON_IMAGE'),
      width: Symbol('ICON_WIDTH')
    };
    const imageBuffer = Symbol('IMAGE_BUFFER');
    const bit = Symbol('BIT_DEPTH');
    const image = parsedImage(iconImageData, imageBuffer, bit);
    expect(image.bit).to.deep.equal(bit);
    expect(image.buffer).to.deep.equal(imageBuffer);
    expect(image.height).to.deep.equal(iconImageData.height);
    expect(image.hotspot).to.deep.equal(iconImageData.hotspot);
    expect(image.width).to.deep.equal(iconImageData.width);
  });
});
