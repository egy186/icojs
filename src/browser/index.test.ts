import { describe, expect, it } from 'vitest';
import Bowser from 'bowser';
import { isSame } from '../test-fixtures/is-same-browser.js';
import { parseICO } from './index.js';

const browserName = Bowser.getParser(window.navigator.userAgent).getBrowserName();

describe('ICO.parseICO in the browser', () => {
  const icons = [
    'basic.ico',
    'cursor.cur',
    'palette.ico',
    'png.ico'
  ];
  icons.forEach(icon => {
    it(`parse ${icon}`, async () => {
      const res = await fetch(`/src/test-fixtures/images/${icon}`);
      const arrayBuffer = await res.arrayBuffer();

      const images = await parseICO(arrayBuffer);
      expect(images.length).toBeGreaterThan(0);

      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, max-statements
      await Promise.all(images.map(async (image, index) => {
        // Skip basic.ico[6], ref: https://github.com/egy186/icojs/pull/106
        if (browserName === 'Firefox') {
          if (icon === 'basic.ico' && index === 6) {
            return;
          }
        }
        if (browserName === 'Safari') {
          if (icon === 'basic.ico' && (index === 1 || index === 4 || index === 5 || index === 6)) {
            return;
          }
          if (icon === 'palette.ico' && index === 0) {
            return;
          }
        }

        const name = `${image.width}x${image.height}-${image.bpp}bit`;
        const expected = `${icon.slice(0, icon.lastIndexOf('.'))}/${name}.png`;

        expect(await isSame(image.buffer, expected)).toBe(true);
      }));
    });
  });
});
