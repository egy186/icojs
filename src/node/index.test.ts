import { decodeIco, encodeIco, isIco } from './index.js';
import { describe, expect, it } from 'vitest';
import { isCur } from '../is-cur.js';
import { testIcon } from '../test-fixtures/test-icon.js';

// eslint-disable-next-line max-lines-per-function
describe('ICO', () => {
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
    ] as const;
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    const matrix = Object.entries(testIcon).flatMap(icon => formats.map(format => [...icon, format] as const));
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    it.for(matrix)('is expected to decode $0 (format: $2)', async ([, { buffer, iconList }, format]) => {
      const images = await decodeIco(buffer, format);
      expect(images.length).toStrictEqual(iconList.length);

      for (const [index, icon] of iconList.entries()) {
        expect(images[index]?.bpp).toStrictEqual(icon.bpp);
        expect(images[index]?.buffer).toBeInstanceOf(ArrayBuffer);
        expect(images[index]?.width).toStrictEqual(icon.width);
        expect(images[index]?.height).toStrictEqual(icon.height);

        if (format === 'image/png') {
          await expect(images[index]?.buffer).toMatchImage(icon.buffer);
        }
      }
    });

    it('is expected to decode hotspot of CUR', async () => {
      const cursorCur = testIcon['cursor.cur'];
      const images = await decodeIco(cursorCur.buffer);
      expect(images.length).toStrictEqual(cursorCur.iconList.length);

      for (const [index, icon] of cursorCur.iconList.entries()) {
        expect(images[index]?.hotspot?.x).not.toBeUndefined();
        expect(images[index]?.hotspot?.x).toStrictEqual(icon.hotspot.x);
        expect(images[index]?.hotspot?.y).not.toBeUndefined();
        expect(images[index]?.hotspot?.y).toStrictEqual(icon.hotspot.y);
      }
    });
  });

  describe('.encodeIco', () => {
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    it.for(Object.entries(testIcon))('is expected to encode %s', async ([, { iconList }]) => {
      // Encoding 32bit BMP is not supported.
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      const filteredIconList = iconList.filter(icon => icon.bpp !== 32);

      const ico = await encodeIco(filteredIconList);
      const images = await decodeIco(ico);
      expect(images.length).toStrictEqual(filteredIconList.length);

      for (const [index, icon] of filteredIconList.entries()) {
        await expect(images[index]?.buffer).toMatchImage(icon.buffer);
      }
    });

    it('is expected to encode hotspot of CUR', async () => {
      const cursorCur = testIcon['cursor.cur'];
      const buffer = await encodeIco(cursorCur.iconList);
      expect(isCur(buffer)).toStrictEqual(true);

      const images = await decodeIco(buffer);
      expect(images.length).toStrictEqual(cursorCur.iconList.length);

      for (const [index, icon] of cursorCur.iconList.entries()) {
        expect(Number.isFinite(images[index]?.hotspot?.x)).toStrictEqual(true);
        expect(images[index]?.hotspot?.x).toStrictEqual(icon.hotspot.x);
        expect(Number.isFinite(images[index]?.hotspot?.y)).toStrictEqual(true);
        expect(images[index]?.hotspot?.y).toStrictEqual(icon.hotspot.y);
      }
    });
  });

  describe('.isIco', () => {
    it('is expected to return true or false', () => {
      // @ts-expect-error test
      expect(() => isIco('it is not buffer')).toThrow(TypeError);
      expect(isIco(testIcon['basic.ico'].buffer)).toStrictEqual(true);
      expect(isIco(new Uint8Array([0, 0, 0, 0]).buffer)).toStrictEqual(false);
      expect(isIco(new Uint8Array([0, 0, 1, 0]).buffer)).toStrictEqual(true);
      expect(isIco(new Uint8Array([1, 0, 1, 0]).buffer)).toStrictEqual(false);
    });
  });
});
