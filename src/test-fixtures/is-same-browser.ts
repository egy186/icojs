import Image from '../browser/image.js';
import pixelmatch from 'pixelmatch';

const readFile = async (url: string): Promise<ArrayBuffer> => {
  const res = await fetch(url);
  return await res.arrayBuffer();
};

const isSame = async (arrayBuffer: Readonly<ArrayBuffer>, fileName: string): Promise<boolean> => {
  const img1 = await Image.decode(arrayBuffer);
  const arrayBuffer2 = await readFile(`/src/test-fixtures/images/${fileName}`);
  const img2 = await Image.decode(arrayBuffer2);
  const diff = pixelmatch(img1.data, img2.data, undefined, img1.width, img1.height, {
    includeAA: true,
    threshold: 0
  });
  return diff === 0;
};

export { isSame };

export default isSame;
