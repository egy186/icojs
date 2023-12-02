import Image from '../../src/node/image.js';
import pixelmatch from 'pixelmatch';
import { readFile } from 'node:fs/promises';

const isSame = async (arrayBuffer, fileName) => {
  const img1 = await Image.decode(arrayBuffer);
  const arrayBuffer2 = await readFile(new URL(`images/${fileName}`, import.meta.url));
  const img2 = await Image.decode(arrayBuffer2);
  const diff = pixelmatch(img1.data, img2.data, null, img1.width, img1.height, {
    includeAA: true,
    threshold: 0
  });
  return diff === 0;
};

export { isSame };

export default isSame;
