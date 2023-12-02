import { expect, use } from 'chai';
import { isICO, parse } from '../../src/node/index.js';
import chaiAsPromised from 'chai-as-promised';
import cursorCur from '../fixtures/images/cursor.js';
import { isSame } from '../fixtures/is-same.js';
import { readFile } from 'node:fs/promises';

use(chaiAsPromised);

describe('ICO', () => {
  describe('.isICO', () => {
    it('is expected to return true or false', async () => {
      const buffer = await readFile(new URL('../fixtures/images/basic.ico', import.meta.url));
      expect(() => isICO('it is not buffer')).to.throw(TypeError);
      expect(isICO(buffer)).to.be.true;
      const d = new ArrayBuffer(4);
      const dv = new DataView(d);
      expect(isICO(d)).to.be.false;
      dv.setUint16(2, 1, true);
      expect(isICO(d)).to.be.true;
      dv.setUint16(0, 1, true);
      expect(isICO(d)).to.be.false;
    });
  });
  describe('.parse', () => {
    it('is expected to be rejected when arg is not buffer', () => {
      const promise = parse([]);
      return expect(promise).to.be.rejectedWith(TypeError);
    });
    it('is expected to be rejected when arg is not ico', () => {
      const promise = parse(new ArrayBuffer(4));
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
          const buffer = await readFile(new URL(`../fixtures/images/${icon}`, import.meta.url));
          const images = await parse(buffer, format);
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
      const buffer = await readFile(new URL('../fixtures/images/cursor.cur', import.meta.url));
      const images = await parse(buffer);
      images.forEach((image, index) => {
        expect(image.hotspot.x).to.deep.equal(cursorCur[index].hotspot.x);
        expect(image.hotspot.y).to.deep.equal(cursorCur[index].hotspot.y);
      });
    });
  });
});
