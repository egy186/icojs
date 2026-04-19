import { decodeIco, encodeIco } from './index.js';
import { describe, expect, it } from 'vitest';
import Bowser from 'bowser';
import { isSame } from '../test-fixtures/is-same-browser.js';

const browserName = Bowser.getParser(window.navigator.userAgent).getBrowserName();

// eslint-disable-next-line max-lines-per-function
describe('ICO in the browser', () => {
  describe('.decodeIco', () => {
    const icons = [
      'basic.ico',
      'cursor.cur',
      'palette.ico',
      'png.ico'
    ];
    icons.forEach(icon => {
      it(`decode ${icon}`, async () => {
        const res = await fetch(`/src/test-fixtures/images/${icon}`);
        const arrayBuffer = await res.arrayBuffer();

        const images = await decodeIco(arrayBuffer);
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
    // eslint-disable-next-line max-statements
    ] as const)('is expected to encode %s', async ([icon, files]) => {
      const imageList = await Promise.all(files.map(async file => {
        const res = await fetch(`/src/test-fixtures/images/${file}`);
        const buffer = await res.arrayBuffer();

        return { buffer };
      }));

      const ico = await encodeIco(imageList);
      const images = await decodeIco(ico);

      expect(images.length).toStrictEqual(imageList.length);

      for (const [index, image] of images.entries()) {
        if (browserName === 'Safari') {
          if (icon === 'basic.ico' && (index === 1 || index === 5)) {
            continue;
          }
          if (icon === 'palette.ico' && index === 0) {
            continue;
          }
        }

        // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-non-null-assertion
        expect(await isSame(image.buffer, files[index]!)).toStrictEqual(true);
      }
    });
  });
});
