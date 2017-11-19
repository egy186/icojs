'use strict';

const ICO = require('../src/node');
const bufferToArrayBuffer = require('../src/node/buffer-to-arraybuffer');
const chai = require('chai');
const cursorCur = require('./fixtures/images/cursor');
const fs = require('fs');
const isSame = require('./fixtures/is-same');
const path = require('path');

const expect = chai.expect;

describe('ICO', () => {
  describe('.isICO', () => {
    it('is expected to return true or false', () => {
      const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/basic.ico'));
      const arrayBuffer = bufferToArrayBuffer(buffer);
      expect(ICO.isICO('it is not buffer')).to.be.false;
      expect(ICO.isICO(buffer)).to.be.true;
      expect(ICO.isICO(arrayBuffer)).to.be.true;
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
      return expect(promise).to.be.rejectedWith('buffer is not ico');
    });
    const icons = [
      'basic.ico',
      'cursor.cur',
      'palette.ico',
      'png.ico'
    ];
    icons.forEach(icon => {
      it(`is expected to parse ${icon}`, () => {
        const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images', `${icon}`));
        const arrayBuffer = bufferToArrayBuffer(buffer);
        const promise = ICO.parse(arrayBuffer).then(images => {
          expect(images).to.be.a('array');
          return images.map(image => {
            expect(image.bit).to.be.a('number');
            expect(image.buffer).to.be.instanceof(ArrayBuffer);
            expect(image.height).to.be.a('number');
            expect(image.width).to.be.a('number');
            const expected = `${icon.slice(0, icon.lastIndexOf('.'))}/${image.width}x${image.height}-${image.bit}bit.png`;
            return isSame(image.buffer, expected);
          });
        });
        return expect(promise).to.eventually.not.include(false);
      });
    });
    it('is expected to parse hotspot of CUR', () => {
      const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/cursor.cur'));
      const promise = ICO.parse(buffer);
      return Promise.all([
        expect(promise.then(images => images[0].hotspot)).to.become(cursorCur[0].hotspot),
        expect(promise.then(images => images[1].hotspot)).to.become(cursorCur[1].hotspot)
      ]);
    });
  });
});
