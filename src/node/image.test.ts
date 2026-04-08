import { describe, expect, it } from 'vitest';
import Image from './image.js';
import { imageData as bmpImageData } from '../test-fixtures/images/bmp.js';
import { fileTypeFromBuffer } from 'file-type';
import { isSame } from '../test-fixtures/is-same.js';
import { readFile } from 'node:fs/promises';

// eslint-disable-next-line max-lines-per-function
describe('Image', () => {
  describe('.decode', () => {
    it('is expected to throw error when mime is not supported', async () => {
      const arrayBuffer = new ArrayBuffer(100);
      await expect(Image.decode(arrayBuffer)).rejects.toThrow(TypeError);
    });
    it('is expected to create ImageData from PNG', async () => {
      const buffer = await readFile(new URL('../test-fixtures/images/1x1/1x1-1bit.png', import.meta.url));
      const imageData = await Image.decode(buffer.buffer);
      expect(imageData.data).toStrictEqual(new Uint8ClampedArray([0, 0, 0, 0]));
      expect(imageData.height).toStrictEqual(1);
      expect(imageData.width).toStrictEqual(1);
    });
    it('is expeted to create ImageData from BMP', async () => {
      const buffer = await readFile(new URL('../test-fixtures/images/bmp.bmp', import.meta.url));
      const imageData = await Image.decode(buffer.buffer);
      expect(imageData.data).toStrictEqual(bmpImageData.data);
      expect(imageData.height).toStrictEqual(bmpImageData.height);
      expect(imageData.width).toStrictEqual(bmpImageData.width);
    });
  });
  describe('.encode', () => {
    it('is expected to create 1x1 PNG from ImageData', async () => {
      const imageArrayBuffer = await Image.encode({
        data: new Uint8ClampedArray([0, 0, 0, 0]),
        height: 1,
        width: 1
      });
      expect(imageArrayBuffer).toBeInstanceOf(ArrayBuffer);
      expect((await fileTypeFromBuffer(Buffer.from(imageArrayBuffer)))?.mime).toStrictEqual('image/png');
      expect(await isSame(imageArrayBuffer, '1x1/1x1-1bit.png')).toStrictEqual(true);
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
        expect((await fileTypeFromBuffer(Buffer.from(imageArrayBuffer)))?.mime).toStrictEqual(mime);
      });
    });

    it('is expected to create BMP from ImageData', async () => {
      const imageArrayBuffer = await Image.encode(bmpImageData, 'image/bmp');
      expect(await isSame(imageArrayBuffer, 'bmp.bmp')).toStrictEqual(true);
    });
  });
});
