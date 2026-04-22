import type { ImageConverter, ImageData as TImageData } from '../image.js';
import { MIME_PNG } from '../image.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Image = {
  /**
   * Create imageData from image.
   *
   * @param arrayBuffer - Image buffer.
   * @returns ImageData.
   * @access private
   */
  // eslint-disable-next-line max-statements
  async decode (arrayBuffer: Readonly<ArrayBuffer>): Promise<TImageData> {
    const blob = new Blob([arrayBuffer]);
    const bitmap = await createImageBitmap(blob);

    try {
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('canvas 2D context is not available');
      }

      ctx.drawImage(bitmap, 0, 0);
      const { data } = ctx.getImageData(0, 0, bitmap.width, bitmap.height);

      return {
        data,
        height: bitmap.height,
        width: bitmap.width
      };
    } finally {
      bitmap.close();
    }
  },

  /**
   * Create image from imgData.data.
   *
   * @param image - Data.
   * @param mime - MIME type.
   * @returns Image.
   * @access private
   */
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  async encode (image: TImageData, mime: string = MIME_PNG): Promise<ArrayBuffer> {
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('canvas 2D context is not available');
    }

    const imageData = new ImageData(new Uint8ClampedArray(image.data), image.width, image.height);
    ctx.putImageData(imageData, 0, 0);

    const blob = await canvas.convertToBlob({ type: mime });
    return await blob.arrayBuffer();
  }
} as const satisfies ImageConverter;

export { Image };

export default Image;
