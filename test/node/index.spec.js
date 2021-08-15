'use strict';

const ICO = require('../../src/node');
const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const cursorCur = require('../fixtures/images/cursor');
const fs = require('fs');
const isSame = require('../fixtures/is-same');
const path = require('path');

use(chaiAsPromised);

describe('ICO', () => {
  describe('.isICO', () => {
    it('is expected to return true or false', () => {
      const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/images/basic.ico'));
      expect(() => ICO.isICO('it is not buffer')).to.throw(TypeError);
      expect(ICO.isICO(buffer)).to.be.true;
      const d = new ArrayBuffer(4);
      const dv = new DataView(d);
      expect(ICO.isICO(d)).to.be.false;
      dv.setUint16(2, 1, true);
      expect(ICO.isICO(d)).to.be.true;
      dv.setUint16(0, 1, true);
      expect(ICO.isICO(d)).to.be.false;
    });
  });
  describe('.parse', () => {
    it('is expected to be rejected when arg is not buffer', () => {
      const promise = ICO.parse([]);
      return expect(promise).to.be.rejectedWith(TypeError);
    });
    it('is expected to be rejected when arg is not ico', () => {
      const promise = ICO.parse(new ArrayBuffer(4));
      return expect(promise).to.be.rejectedWith('Truncated header');
    });
    const formats = [
      'image/bmp',
      'image/jpeg',
      'image/png',
      undefined
    ];
    const icons = [
      'basic.ico',
      'cursor.cur',
      'palette.ico',
      'png.ico'
    ];
    formats.forEach(format => {
      icons.forEach(icon => {
        it(`is expected to parse ${icon} (${format || 'default'})`, async () => {
          const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/images', `${icon}`));
          const images = await ICO.parse(buffer, format);
          expect(images).to.be.an('array');
          await Promise.all(images.map(async image => {
            expect(image.bpp).to.be.a('number');
            expect(image.buffer).to.be.instanceof(ArrayBuffer);
            expect(image.height).to.be.a('number');
            expect(image.width).to.be.a('number');
            const expected = `${icon.slice(0, icon.lastIndexOf('.'))}/${image.width}x${image.height}-${image.bpp}bit.png`;
            if (format === 'image/png') {
              expect(await isSame(image.buffer, expected)).to.be.true;
            }
          }));
        });
      });
    });
    it('is expected to parse hotspot of CUR', async () => {
      const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/images/cursor.cur'));
      const images = await ICO.parse(buffer);
      images.forEach((image, index) => {
        expect(image.hotspot.x).to.deep.equal(cursorCur[index].hotspot.x);
        expect(image.hotspot.y).to.deep.equal(cursorCur[index].hotspot.y);
      });
    });
  });
});
