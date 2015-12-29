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

const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/basic.ico'));
const data = bufferToArrayBuffer(buffer);
const length = fs.readdirSync(path.join(__dirname, './fixtures/images/basic')).length;

describe('ICO', () => {
  describe('.isICO', () => {
    it('is expected to be a function', () => {
      expect(ICO.isICO).to.be.a('function');
    });
    it('is expected to return true or false', () => {
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
      return expect(ICO.parse(new ArrayBuffer(4))).to.be.rejectedWith('buffer is not ico');
    });
    it('is expected to parse ico', () => {
      const promise = ICO.parse(data).then(images => {
        expect(images).to.be.a('array').with.length(length);
        return Promise.all(images.map(image => {
          expect(image).to.be.a('object');
          expect(image.buffer instanceof ArrayBuffer).to.be.true;
          return isSame(image.buffer, 'basic/' + image.width + 'x' + image.height + '-' + image.bit + 'bit.png');
        }));
      });
      return expect(promise).to.become(new Array(length).fill(true));
    });
  });
  describe('.noConflict', () => {
    it('is expected to be a function', () => {
      expect(ICO.noConflict).to.be.a('function');
    });
    it('is expected to return ico', () => {
      expect(ICO.noConflict).to.be.a('function');
      const newIco = ICO.noConflict();
      expect(newIco.parse).to.be.a('function');
      expect(newIco.isICO).to.be.a('function');
    });
  });
});
