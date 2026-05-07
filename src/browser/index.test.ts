import { decodeIco, encodeIco } from './index.js';
import { describe, expect, it } from 'vitest';
import { getParser } from 'bowser';
import { testIcon } from '../test-fixtures/test-icon.js';

const browserName = getParser(window.navigator.userAgent).getBrowserName();

describe('ICO in the browser', () => {
  describe('.decodeIco', () => {
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, max-statements
    it.for(Object.entries(testIcon))('is expected to decode %s', async ([iconName, { buffer, iconList }]) => {
      const images = await decodeIco(buffer);
      expect(images.length).toStrictEqual(iconList.length);

      for (const [index, icon] of iconList.entries()) {
        expect(images[index]?.bpp).toStrictEqual(icon.bpp);
        expect(images[index]?.buffer).toBeInstanceOf(ArrayBuffer);
        expect(images[index]?.width).toStrictEqual(icon.width);
        expect(images[index]?.height).toStrictEqual(icon.height);

        // Skip browser specific test failures, ref: https://github.com/egy186/icojs/pull/106
        if (browserName === 'Firefox' || browserName === 'Safari') {
          if (iconName === 'basic.ico' && index === 6) {
            continue;
          }
        }

        await expect(images[index]?.buffer).toMatchImage(icon.buffer);
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
  });
});
