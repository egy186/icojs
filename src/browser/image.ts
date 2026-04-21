import type { ImageConverter, ImageData } from '../image.js';
import { MIME_PNG } from '../image.js';

const dataURLToArrayBuffer = (dataURL: string): ArrayBuffer => {
  const string = atob(dataURL.replace(/.+,/u, ''));
  const view = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    view[i] = string.charCodeAt(i);
  }
  return view.buffer;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const Image = {
  /**
   * Create imageData from image.
   *
   * @param arrayBuffer - Image buffer.
   * @returns ImageData.
   * @access private
   */
  async decode (arrayBuffer: Readonly<ArrayBuffer>): Promise<ImageData> {
    return await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(new Blob([arrayBuffer]));
      const img = document.createElement('img');

      img.src = url;

      img.onerror = (): void => {
        reject(new Error('failed to load image'));
      };

      img.onload = (): void => {
        const { naturalHeight: height, naturalWidth: width } = img;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('canvas 2D context is not available');
        }

        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, width, height);

        resolve({
          data,
          height,
          width
        });
      };
    });
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
  async encode (image: ImageData, mime: string = MIME_PNG): Promise<ArrayBuffer> {
    // eslint-disable-next-line max-statements
    return await new Promise(resolve => {
      const { data, height, width } = image;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('canvas 2D context is not available');
      }

      const imageData = ctx.createImageData(width, height);
      const dataData = imageData.data;
      for (let i = 0; i < dataData.length; i++) {
        dataData[i] = data[i] ?? 0;
      }
      ctx.putImageData(imageData, 0, 0);

      resolve(dataURLToArrayBuffer(canvas.toDataURL(mime)));
    });
  }
} as const satisfies ImageConverter;

export { Image };

export default Image;
