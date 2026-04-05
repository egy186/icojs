import Image from '../browser/image.js';
import pixelmatch from 'pixelmatch';

const readFile = async url => {
  const res = await fetch(url);
  return await res.arrayBuffer();
};

const isSame = async (arrayBuffer, fileName) => {
  const img1 = await Image.decode(arrayBuffer);
  const arrayBuffer2 = await readFile(new URL(`./images/${fileName}`, new URL(import.meta.url)));
  const img2 = await Image.decode(arrayBuffer2);
  const diff = pixelmatch(img1.data, img2.data, null, img1.width, img1.height, {
    includeAA: true,
    threshold: 0
  });
  return diff === 0;
};

export { isSame };

export default isSame;
