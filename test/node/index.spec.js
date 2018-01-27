'use strict';

const ICO = require('../../src/node');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const cursorCur = require('../fixtures/images/cursor');
const fs = require('fs');
const isSame = require('../fixtures/is-same');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

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
    formats.forEach(format => icons.forEach(icon => {
      it(`is expected to parse ${icon} (${format || 'default'})`, () => {
        const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/images', `${icon}`));
        const promise = ICO.parse(buffer, format).then(images => {
          expect(images).to.be.an('array');
          return images.map(image => {
            expect(image.bpp).to.be.a('number');
            expect(image.data).to.be.instanceof(Uint8Array);
            expect(image.height).to.be.a('number');
            expect(image.width).to.be.a('number');
            const expected = `${icon.slice(0, icon.lastIndexOf('.'))}/${image.width}x${image.height}-${image.bpp}bit.png`;
            return format === 'image/png' ? isSame(image.data, expected) : true;
          });
        });
        return expect(promise).to.eventually.not.include(false);
      });
    }));
    it('is expected to parse hotspot of CUR', () => {
      const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/images/cursor.cur'));
      const promise = ICO.parse(buffer);
      return Promise.all([
        expect(promise.then(images => images[0].hotspot)).to.become(cursorCur[0].hotspot),
        expect(promise.then(images => images[1].hotspot)).to.become(cursorCur[1].hotspot)
      ]);
    });
  });
  describe('.parseSync', () => {
    it('is expected to be rejected when arg is not buffer', () => {
      expect(() => ICO.parseSync([])).to.throw(TypeError);
    });
    it('is expected to be rejected when arg is not ico', () => {
      expect(() => ICO.parseSync(new ArrayBuffer(4))).to.throw('Truncated header');
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
    formats.forEach(format => icons.forEach(icon => {
      it(`is expected to parse ${icon} (${format || 'default'})`, () => {
        const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/images', `${icon}`));
        const images = ICO.parseSync(buffer, format);
        expect(images).to.be.an('array');
        images.forEach(image => {
          expect(image.bpp).to.be.a('number');
          expect(image.data).to.be.instanceof(Uint8Array);
          expect(image.height).to.be.a('number');
          expect(image.width).to.be.a('number');
          const expected = `${icon.slice(0, icon.lastIndexOf('.'))}/${image.width}x${image.height}-${image.bpp}bit.png`;
          if (format === 'image/png') {
            expect(isSame(image.data, expected)).to.be.true;
          }
        });
      });
    }));
    it('is expected to parse hotspot of CUR', () => {
      const buffer = fs.readFileSync(path.join(__dirname, '../fixtures/images/cursor.cur'));
      const images = ICO.parseSync(buffer);
      expect(images[0].hotspot).to.deep.equal(cursorCur[0].hotspot);
      expect(images[1].hotspot).to.deep.equal(cursorCur[1].hotspot);
    });
  });
});
