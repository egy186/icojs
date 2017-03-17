'use strict';

const bufferToArrayBuffer = require('../src/utils/buffer-to-arraybuffer');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const cursorCur = require('./fixtures/images/cursor');
const fs = require('fs');
const isSame = require('./fixtures/is-same');
const parse = require('../src/parse');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('ICO', () => {
  describe('.parse', () => {
    it('is expected to be rejected when arg is not buffer', () => {
      const promise = parse([]);
      return expect(promise).to.be.rejectedWith(TypeError);
    });
    it('is expected to be rejected when arg is not ico', () => {
      const promise = parse(new ArrayBuffer(4));
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
        const promise = parse(arrayBuffer).then(images => {
          expect(images).to.be.a('array');
          return Promise.all(images.map(image => {
            expect(image.bit).to.be.a('number');
            expect(image.buffer).to.be.instanceof(ArrayBuffer);
            expect(image.height).to.be.a('number');
            expect(image.width).to.be.a('number');
            const expected = `${icon.slice(0, icon.lastIndexOf('.'))}/${image.width}x${image.height}-${image.bit}bit.png`;
            return isSame(image.buffer, expected);
          }));
        });
        return expect(promise).to.eventually.not.include(false);
      });
    });
    it('is expected to parse hotspot of CUR', () => {
      const buffer = fs.readFileSync(path.join(__dirname, './fixtures/images/cursor.cur'));
      const promise = parse(buffer);
      return Promise.all([
        expect(promise.then(images => images[0].hotspot)).to.become(cursorCur[0].hotspot),
        expect(promise.then(images => images[1].hotspot)).to.become(cursorCur[1].hotspot)
      ]);
    });
  });
});
