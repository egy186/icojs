'use strict';

const dataUriToBuffer = require('data-uri-to-buffer');
const fileUrl = require('file-url');
const isSame = require('../fixtures/is-same');
const path = require('path');
const { test, expect } = require('@playwright/test');

const parseInBrowser = async (page, iconFilePath) => {
  await page.goto(fileUrl(path.join(__dirname, 'index.html')));
  await page.setInputFiles('#ico-parse-input', iconFilePath);
  const imgs = await page.$$eval('#ico-parse-result img', results => results.map(result => ({
    src: result.getAttribute('src'),
    title: result.getAttribute('title')
  })));
  return imgs.map(img => ({
    buffer: dataUriToBuffer(img.src),
    name: img.title
  }));
};

test.describe('ICO.parse in the browser', () => {
  const icons = [
    'basic.ico',
    'cursor.cur',
    'palette.ico',
    'png.ico'
  ];
  icons.forEach(icon => {
    test(`parse ${icon}`, async ({ page }) => {
      const images = await parseInBrowser(page, path.join(__dirname, `../fixtures/images/${icon}`));

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
