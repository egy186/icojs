import { decodeIco, encodeIco, isIco } from './index.js';
import { describe, expect, it } from 'vitest';
import cursorCur from '../test-fixtures/images/cursor.js';
import { isCur } from '../is-cur.js';
import { isSame } from '../test-fixtures/is-same.js';
import { readFile } from 'node:fs/promises';

// eslint-disable-next-line max-lines-per-function
describe('ICO', () => {
  // eslint-disable-next-line max-lines-per-function
  describe('.decodeIco', () => {
    it('is expected to be rejected when arg is not buffer', async () => {
      // @ts-expect-error test
      const promise = decodeIco([]);
      await expect(promise).rejects.toThrow(TypeError);
    });
    it('is expected to be rejected when arg is not ico', async () => {
      const promise = decodeIco(new ArrayBuffer(4));
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
        it(`is expected to decode ${icon} (${format ?? 'default'})`, async () => {
          const buffer = await readFile(new URL(`../test-fixtures/images/${icon}`, import.meta.url));
          const images = await decodeIco(buffer, format);
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
    it('is expected to decode hotspot of CUR', async () => {
      const buffer = await readFile(new URL('../test-fixtures/images/cursor.cur', import.meta.url));
      const images = await decodeIco(buffer);
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      images.forEach((image, index) => {
        expect(image.hotspot?.x).not.toBeUndefined();
        expect(image.hotspot?.x).toStrictEqual(cursorCur[index]?.hotspot.x);
        expect(image.hotspot?.y).not.toBeUndefined();
        expect(image.hotspot?.y).toStrictEqual(cursorCur[index]?.hotspot.y);
      });
    });
  });

  // eslint-disable-next-line max-lines-per-function
  describe('.encodeIco', () => {
    it.for([
      [
        'basic.ico',
        [
          'basic/16x16-1bit.png',
          'basic/32x32-4bit.png',
          'basic/48x48-8bit.png',
          'basic/96x96-24bit.png',
          'basic/256x256-4bit.png',
          'basic/5x32-4bit.png'
          // 'basic/32x32-32bit.png' // Encoding 32bit BMP is not supported.
        ]
      ],
      [
        'cursor.cur',
        [
          'cursor/32x32-32bit.png',
          'cursor/48x48-32bit.png'
        ]
      ],
      [
        'palette.ico',
        ['palette/32x32-4bit.png']
      ],
      [
        'png.ico',
        ['png/256x256-32bit.png']
      ]
    ] as const)('is expected to encode %s', async ([_icon, files]) => {
      const imageList = await Promise.all(files.map(async file => {
        const fileUrl = new URL(`../test-fixtures/images/${file}`, import.meta.url);
        const buffer = await readFile(fileUrl);

        return { buffer };
      }));

      const ico = await encodeIco(imageList);
      const images = await decodeIco(ico);

      expect(images.length).toStrictEqual(files.length);

      for (const [index, image] of images.entries()) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, no-await-in-loop
        expect(await isSame(image.buffer, files[index]!)).toStrictEqual(true);
      }
    });

    it('is expected to encode hotspot of CUR', async () => {
      const imageList = await Promise.all([
        'cursor/32x32-32bit.png',
        'cursor/48x48-32bit.png'
      ].map(async (file, index) => {
        const fileUrl = new URL(`../test-fixtures/images/${file}`, import.meta.url);
        const buffer = await readFile(fileUrl);

        return {
          buffer,
          hotspot: cursorCur[index]?.hotspot
        };
      }));

      const cur = await encodeIco(imageList);
      expect(isCur(cur)).toStrictEqual(true);

      const images = await decodeIco(cur);

      for (const [index, image] of images.entries()) {
        expect(Number.isFinite(image.hotspot?.x)).toStrictEqual(true);
        expect(image.hotspot?.x).toStrictEqual(cursorCur[index]?.hotspot.x);
        expect(Number.isFinite(image.hotspot?.y)).toStrictEqual(true);
        expect(image.hotspot?.y).toStrictEqual(cursorCur[index]?.hotspot.y);
      }
    });
  });

  describe('.isIco', () => {
    it('is expected to return true or false', async () => {
      const buffer = await readFile(new URL('../test-fixtures/images/basic.ico', import.meta.url));
      // @ts-expect-error test
      expect(() => isIco('it is not buffer')).toThrow(TypeError);
      expect(isIco(buffer)).toStrictEqual(true);
      const d = new ArrayBuffer(4);
      const dv = new DataView(d);
      expect(isIco(d)).toStrictEqual(false);
      dv.setUint16(2, 1, true);
      expect(isIco(d)).toStrictEqual(true);
      dv.setUint16(0, 1, true);
      expect(isIco(d)).toStrictEqual(false);
    });
  });
});
