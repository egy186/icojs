import { expect, test } from '@playwright/test';
import { dataUriToBuffer } from 'data-uri-to-buffer';
import { fileURLToPath } from 'node:url';
import { isSame } from '../fixtures/is-same.js';

const parseInBrowser = async (page, iconFileUrl) => {
  await page.goto(new URL('index.html', import.meta.url).toString());
  await page.setInputFiles('#ico-parse-input', fileURLToPath(iconFileUrl));
  await page.waitForSelector('#ico-parse-result img');
  const imgs = await page.$$eval('#ico-parse-result img', results => results.map(result => ({
    src: result.getAttribute('src'),
    title: result.getAttribute('title')
  })));
  return imgs.map(img => ({
    buffer: Buffer.from(dataUriToBuffer(img.src).buffer),
    name: img.title
  }));
};

test.describe('ICO.parseICO in the browser', () => {
  const icons = [
    'basic.ico',
    'cursor.cur',
    'palette.ico',
    'png.ico'
  ];
  icons.forEach(icon => {
    test(`parse ${icon}`, async ({ page }) => {
      const images = await parseInBrowser(page, new URL(`../fixtures/images/${icon}`, import.meta.url));
      expect(images.length).toBeGreaterThan(0);

      await Promise.all(images.map(async (image, index) => {
        const expected = `${icon.slice(0, icon.lastIndexOf('.'))}/${image.name}.png`;
        // Skip basic.ico[6], ref: https://github.com/egy186/icojs/pull/106
        if (icon === 'basic.ico' && index === 6) {
          return;
        }
        expect(await isSame(image.buffer, expected)).toStrictEqual(true);
      }));
    });
  });
});
