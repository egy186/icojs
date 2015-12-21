'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

const util = require('../src/util');
const extractOne = require('../src/extractone');
const ICO = require('../src/index');
const PNG = require('../src/png');

const data = require('./fixtures/index');
const bufferToBase64 = data.bufferToBase64;
const isSame = require('./fixtures/is-same');

describe('util', () => {
  it('is expected to have 4 functions', () => {
    expect(util).to.be.a('object');
    expect(util.to1bitArray).to.be.a('function');
    expect(util.to4bitArray).to.be.a('function');
    expect(util.to8bitArray).to.be.a('function');
    expect(util.toDividableBy4).to.be.a('function');
  });
  describe('.to1bitArray', () => {
    it('is expected to return 1 bit array', () => {
      expect(util.to1bitArray(new Uint8Array([0]).buffer)).to.be.a('array').with.length(8);
      expect(util.to1bitArray(new Uint8Array([0]).buffer).join()).to.equal([0, 0, 0, 0, 0, 0, 0, 0].join());
      expect(util.to1bitArray(new Uint8Array([1]).buffer).join()).to.equal([0, 0, 0, 0, 0, 0, 0, 1].join());
      expect(util.to1bitArray(new Uint8Array([2]).buffer).join()).to.equal([0, 0, 0, 0, 0, 0, 1, 0].join());
      expect(util.to1bitArray(new Uint8Array([3]).buffer).join()).to.equal([0, 0, 0, 0, 0, 0, 1, 1].join());
      expect(util.to1bitArray(new Uint8Array([255]).buffer).join()).to.equal([1, 1, 1, 1, 1, 1, 1, 1].join());
      expect(util.to1bitArray(new Uint8Array([1, 64, 8, 16, 4, 32, 2, 128]).buffer).join()).to.equal([
        0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0
      ].join());
    });
  });
  describe('.to4bitArray', () => {
    it('is expected to return 4 bit array', () => {
      expect(util.to4bitArray(new Uint8Array([0]).buffer)).to.be.a('array').with.length(2);
      expect(util.to4bitArray(new Uint8Array([0]).buffer).join()).to.equal([0, 0].join());
      expect(util.to4bitArray(new Uint8Array([1]).buffer).join()).to.equal([0, 1].join());
      expect(util.to4bitArray(new Uint8Array([15]).buffer).join()).to.equal([0, 15].join());
      expect(util.to4bitArray(new Uint8Array([16]).buffer).join()).to.equal([1, 0].join());
      expect(util.to4bitArray(new Uint8Array([17]).buffer).join()).to.equal([1, 1].join());
      expect(util.to4bitArray(new Uint8Array([255]).buffer).join()).to.equal([15, 15].join());
      expect(util.to4bitArray(new Uint8Array([1, 64, 8, 16, 4, 32, 2, 128]).buffer).join()).to.equal([
        0, 1, 4, 0, 0, 8, 1, 0, 0, 4, 2, 0, 0, 2, 8, 0
      ].join());
    });
  });
  describe('.to8bitArray', () => {
    it('is expected to return 8 bit array', () => {
      expect(util.to8bitArray(new Uint8Array([0]).buffer)).to.be.a('array').with.length(1);
      expect(util.to8bitArray(new Uint8Array([0]).buffer).join()).to.equal([0].join());
      expect(util.to8bitArray(new Uint8Array([1]).buffer).join()).to.equal([1].join());
      expect(util.to8bitArray(new Uint8Array([2]).buffer).join()).to.equal([2].join());
      expect(util.to8bitArray(new Uint8Array([3]).buffer).join()).to.equal([3].join());
      expect(util.to8bitArray(new Uint8Array([255]).buffer).join()).to.equal([255].join());
      expect(util.to8bitArray(new Uint8Array([1, 64, 8, 16, 4, 32, 2, 128]).buffer).join()).to.equal([
        1, 64, 8, 16, 4, 32, 2, 128
      ].join());
    });
  });
  describe('.toDividableBy4', () => {
    it('is expected to return a number dividable by 4', () => {
      expect(util.toDividableBy4(0)).to.equal(0);
      expect(util.toDividableBy4(1)).to.equal(4);
      expect(util.toDividableBy4(2)).to.equal(4);
      expect(util.toDividableBy4(3)).to.equal(4);
      expect(util.toDividableBy4(4)).to.equal(4);
      expect(util.toDividableBy4(5)).to.equal(8);
    });
  });
});

describe('PNG', () => {
  it('is expected to have 1 function', () => {
    expect(PNG).to.be.a('object');
    expect(PNG.encode).to.be.a('function');
  });
  describe('.encode', () => {
    it('is expected to create png from imageData.data', () => {
      const pngData = {
        width: 1,
        height: 1,
        imageData: [0, 0, 0, 0],
        expected: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='
      };
      const promise = PNG.encode({
        width: pngData.width,
        height: pngData.height,
        data: new Uint8ClampedArray(pngData.imageData)
      });
      return expect(promise.then(ab => {
        expect(ab instanceof ArrayBuffer).to.be.true;
        return isSame(ab, '1x1-1bit.png');
      })).to.become(true);
    });
  });
});

describe('extractOne', () => {
  it('is expected to be a function', () => {
    expect(extractOne).to.be.a('function');
  });
  it('is expected to return extracted ico', () => {
    let ico;
    for (let i = 0; i < data.expected.length; i++) {
      ico = extractOne(data.arrayBuffer, i);
      expect(ico).to.be.a('object');
      expect(ico.width).to.equal(data.expected[i].width);
      expect(ico.height).to.equal(data.expected[i].height);
      expect(ico.colorCount).to.equal(data.expected[i].colorCount);
      expect(ico.bit).to.equal(data.expected[i].bit);
      expect(ico.colors).to.be.a('array');
      expect(ico.colors.join('|')).to.equal(data.expected[i].colors);
      expect(ico.xor instanceof ArrayBuffer).to.be.true;
      expect(bufferToBase64(ico.xor)).to.equal(data.expected[i].xor);
      expect(ico.and instanceof ArrayBuffer).to.be.true;
      expect(bufferToBase64(ico.and)).to.equal(data.expected[i].and);
    }
  });
});

describe('ICO', () => {
  it('is expected to have 3 functions', () => {
    expect(ICO).to.be.a('object');
    expect(ICO.isICO).to.be.a('function');
    expect(ICO.parse).to.be.a('function');
    expect(ICO.noConflict).to.be.a('function');
  });
  describe('.isICO', () => {
    it('is expected to return true or false', () => {
      expect(ICO.isICO('it is not buffer')).to.be.false;
      expect(ICO.isICO(data.arrayBuffer)).to.be.true;
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
    it('is expected to throw error when arg is not ico', () => {
      expect(() => {
        ICO.parse(new ArrayBuffer(4));
      }).to.throw('buffer is not ico');
    });
    it('is expected to parse ico', () => {
      const promise = ICO.parse(data.arrayBuffer);
      return expect(promise.then(arr => {
        expect(arr).to.be.a('array').with.length(data.expected.length);
        return Promise.all(arr.map(image => {
          expect(image).to.be.a('object');
          expect(image.buffer instanceof ArrayBuffer).to.be.true;
          return isSame(image.buffer, image.width + 'x' + image.height + '-' + image.bit + 'bit.png');
        })).then(flags => flags.sort()[0]);
      })).to.become(true);
    });
  });
  describe('.noConflict', () => {
    it('is expected to return ico', () => {
      expect(ICO.noConflict).to.be.a('function');
      const newIco = ICO.noConflict();
      expect(newIco).to.be.a('object');
      expect(newIco.parse).to.be.a('function');
      expect(newIco.isICO).to.be.a('function');
    });
  });
});
