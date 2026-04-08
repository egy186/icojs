import { describe, expect, it } from 'vitest';
import { isICO, parseICO } from './index.js';
import cursorCur from '../test-fixtures/images/cursor.js';
import { isSame } from '../test-fixtures/is-same.js';
import { readFile } from 'node:fs/promises';

// eslint-disable-next-line max-lines-per-function
describe('ICO', () => {
  describe('.isICO', () => {
    it('is expected to return true or false', async () => {
      const buffer = await readFile(new URL('../test-fixtures/images/basic.ico', import.meta.url));
      // @ts-expect-error test
      expect(() => isICO('it is not buffer')).toThrow(TypeError);
      expect(isICO(buffer)).toStrictEqual(true);
      const d = new ArrayBuffer(4);
      const dv = new DataView(d);
      expect(isICO(d)).toStrictEqual(false);
      dv.setUint16(2, 1, true);
      expect(isICO(d)).toStrictEqual(true);
      dv.setUint16(0, 1, true);
      expect(isICO(d)).toStrictEqual(false);
    });
  });

  // eslint-disable-next-line max-lines-per-function
  describe('.parse', () => {
    it('is expected to be rejected when arg is not buffer', async () => {
      // @ts-expect-error test
      const promise = parseICO([]);
      await expect(promise).rejects.toThrow(TypeError);
    });
    it('is expected to be rejected when arg is not ico', async () => {
      const promise = parseICO(new ArrayBuffer(4));
      await expect(promise).rejects.toThrow('Truncated header');
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
        it(`is expected to parse ${icon} (${format ?? 'default'})`, async () => {
          const buffer = await readFile(new URL(`../test-fixtures/images/${icon}`, import.meta.url));
          const images = await parseICO(buffer, format);
          expect(Array.isArray(images)).toStrictEqual(true);
          // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
          await Promise.all(images.map(async image => {
            expect(typeof image.bpp).toStrictEqual('number');
            expect(image.buffer).toBeInstanceOf(ArrayBuffer);
            expect(typeof image.height).toStrictEqual('number');
            expect(typeof image.width).toStrictEqual('number');
            const expected = `${icon.slice(0, icon.lastIndexOf('.'))}/${image.width}x${image.height}-${image.bpp}bit.png`;
            if (format === 'image/png') {
              expect(await isSame(image.buffer, expected)).toStrictEqual(true);
            }
          }));
        });
      });
    });
    it('is expected to parse hotspot of CUR', async () => {
      const buffer = await readFile(new URL('../test-fixtures/images/cursor.cur', import.meta.url));
      const images = await parseICO(buffer);
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      images.forEach((image, index) => {
        expect(image.hotspot?.x).not.toBeUndefined();
        expect(image.hotspot?.x).toStrictEqual(cursorCur[index]?.hotspot.x);
        expect(image.hotspot?.y).not.toBeUndefined();
        expect(image.hotspot?.y).toStrictEqual(cursorCur[index]?.hotspot.y);
      });
    });
  });
});
