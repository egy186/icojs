import { describe, expect, it } from 'vitest';
import { Image } from './image.js';
import { fileTypeFromBuffer } from 'file-type';
import { testImageData } from '../test-fixtures/test-image-data.js';

describe('Image', () => {
  describe('.decode', () => {
    it('is expected to throw error when mime is not supported', async () => {
      const arrayBuffer = new ArrayBuffer(100);
      await expect(Image.decode(arrayBuffer)).rejects.toThrow(TypeError);
    });

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    it.for(Object.entries(testImageData))('is expected to create ImageData from %s', async ([,{ buffer, imageData }]) => {
      const result = await Image.decode(buffer);
      expect(result.data).toStrictEqual(imageData.data);
      expect(result.height).toStrictEqual(imageData.height);
      expect(result.width).toStrictEqual(imageData.width);
    });
  });

  describe('.encode', () => {
    it('is expected to create PNG from ImageData', async () => {
      const imageArrayBuffer = await Image.encode(testImageData['png.png'].imageData);
      expect(imageArrayBuffer).toBeInstanceOf(ArrayBuffer);
      expect((await fileTypeFromBuffer(Buffer.from(imageArrayBuffer)))?.mime).toStrictEqual('image/png');
      await expect(imageArrayBuffer).toMatchImage(testImageData['png.png'].buffer);
    });

    it.for([
      'image/bmp',
      'image/jpeg',
      'image/png'
    ] as const)('is expected to create %s from ImageData', async mime => {
      const imageArrayBuffer = await Image.encode({
        data: new Uint8ClampedArray([0, 0, 0, 0]),
        height: 1,
        width: 1
      }, mime);
      expect((await fileTypeFromBuffer(Buffer.from(imageArrayBuffer)))?.mime).toStrictEqual(mime);
    });

    it('is expected to create BMP from ImageData', async () => {
      const imageArrayBuffer = await Image.encode(testImageData['bmp.bmp'].imageData, 'image/bmp');
      await expect(imageArrayBuffer).toMatchImage(testImageData['bmp.bmp'].buffer);
    });
  });
});
