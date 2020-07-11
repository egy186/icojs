'use strict';

const dataUriToBuffer = require('data-uri-to-buffer');
const isSame = require('../fixtures/is-same');
const path = require('path');
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const { inlineSource } = require('inline-source');

const parseInBrowser = async iconFilePath => {
  const content = await inlineSource(path.join(__dirname, 'index.html'), { compress: false });
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(content);
  const inputElement = await page.$('#ico-parse-input');
  await inputElement.uploadFile(iconFilePath);
  await page.waitForSelector('#ico-parse-result img');
  const imgs = await page.$$eval('#ico-parse-result img', results => results.map(result => ({
    src: result.src,
    title: result.title
  })));
  browser.close();
  return imgs.map(img => ({
    buffer: dataUriToBuffer(img.src),
    name: img.title
  }));
};

describe('ICO.parse in the browser', () => {
  const icons = [
    'basic.ico',
    'cursor.cur',
    'palette.ico',
    'png.ico'
  ];
  icons.forEach(icon => {
    it(`is expected to parse ${icon}`, async () => {
      const images = await parseInBrowser(path.join(__dirname, `../fixtures/images/${icon}`));
      await Promise.all(images.map(async (image, index) => {
        const expected = `${icon.slice(0, icon.lastIndexOf('.'))}/${image.name}.png`;
        // Skip basic.ico[6], ref: https://github.com/egy186/icojs/pull/106
        if (icon === 'basic.ico' && index === 6) {
          return;
        }
        expect(await isSame(image.buffer, expected)).to.be.true;
      }));
    }).timeout(5000);
  });
});
