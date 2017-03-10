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

describe('ICO', () => {
  describe('.isICO', () => {
    it('is expected to be a function', () => {
      expect(ICO.isICO).to.be.a('function');
    });
    it('is expected to return true or false', () => {
      const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/basic.ico'));
      const data = bufferToArrayBuffer(buffer);
      expect(ICO.isICO('it is not buffer')).to.be.false;
      expect(ICO.isICO(data)).to.be.true;
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
    it('is expected to be a function', () => {
      expect(ICO.parse).to.be.a('function');
    });
    it('is expected to be rejected when arg is not ico', () => {
      const promise = ICO.parse(new ArrayBuffer(4));
      return expect(promise).to.be.rejectedWith('buffer is not ico');
    });
    const icons = ['basic', 'palette'];
    icons.forEach(icon => {
      it(`is expected to parse ${icon}.ico`, () => {
        const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images', `${icon}.ico`));
        const data = bufferToArrayBuffer(buffer);
        const promise = ICO.parse(data).then(images => {
          expect(images).to.be.a('array');
          return Promise.all(images.map(image => {
            expect(image).to.be.a('object');
            expect(image.buffer instanceof ArrayBuffer).to.be.true;
            return isSame(image.buffer, `${icon}/${image.width}x${image.height}-${image.bit}bit.png`);
          }));
        });
        return expect(promise).eventually.not.to.include(false);
      });
    });
  });
});
