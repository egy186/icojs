import { expect, use } from 'chai';
import Image from '../../src/node/image.js';
import { imageData as bmpImageData } from '../fixtures/images/bmp.js';
import chaiAsPromised from 'chai-as-promised';
import { fileTypeFromBuffer } from 'file-type';
import { isSame } from '../fixtures/is-same.js';
import { readFile } from 'node:fs/promises';

use(chaiAsPromised);

describe('Image', () => {
  describe('.decode', () => {
    it('is expected to throw error when mime is not supported', () => {
      const arrayBuffer = new ArrayBuffer(100);
      expect(Image.decode(arrayBuffer)).to.be.rejectedWith(TypeError);
    });
    it('is expected to create ImageData from PNG', async () => {
      const buffer = await readFile(new URL('../fixtures/images/1x1/1x1-1bit.png', import.meta.url));
      const imageData = await Image.decode(buffer);
      expect(imageData.data).to.deep.equal(new Uint8ClampedArray([0, 0, 0, 0]));
      expect(imageData.height).to.deep.equal(1);
      expect(imageData.width).to.deep.equal(1);
    });
    it('is expeted to create ImageData from BMP', async () => {
      const buffer = await readFile(new URL('../fixtures/images/bmp.bmp', import.meta.url));
      const imageData = await Image.decode(buffer);
      expect(imageData.data).to.deep.equal(bmpImageData.data);
      expect(imageData.height).to.deep.equal(bmpImageData.height);
      expect(imageData.width).to.deep.equal(bmpImageData.width);
    });
  });
  describe('.encode', () => {
    it('is expected to create 1x1 PNG from ImageData', async () => {
      const imageArrayBuffer = await Image.encode({
        data: new Uint8ClampedArray([0, 0, 0, 0]),
        height: 1,
        width: 1
      });
      expect(imageArrayBuffer).to.be.an.instanceof(ArrayBuffer);
      expect((await fileTypeFromBuffer(Buffer.from(imageArrayBuffer)))?.mime).to.deep.equal('image/png');
      expect(await isSame(imageArrayBuffer, '1x1/1x1-1bit.png')).to.be.true;
    });
    const mimeTypes = [
      'image/bmp',
      'image/jpeg',
      'image/png'
    ];
    mimeTypes.forEach(mime => {
      it(`is expected to create ${mime} from ImageData`, async () => {
        const imageArrayBuffer = await Image.encode({
          data: new Uint8ClampedArray([0, 0, 0, 0]),
          height: 1,
          width: 1
        }, mime);
        expect((await fileTypeFromBuffer(Buffer.from(imageArrayBuffer)))?.mime).to.deep.equal(mime);
      });
    });

    it('is expected to create BMP from ImageData', async () => {
      const imageArrayBuffer = await Image.encode(bmpImageData, 'image/bmp');
      expect(await isSame(imageArrayBuffer, 'bmp.bmp')).to.be.true;
    });
  });
});
