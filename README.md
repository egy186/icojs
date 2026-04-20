# icojs

[![npm](https://img.shields.io/npm/v/icojs.svg)](https://www.npmjs.com/package/icojs)
[![CI](https://github.com/egy186/icojs/actions/workflows/ci.yml/badge.svg)](https://github.com/egy186/icojs/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/egy186/icojs/badge.svg?branch=main)](https://coveralls.io/github/egy186/icojs?branch=main)

A JavaScript library to use ICO.
Works on both Node.js and the browser.

## Install

```sh
npm install icojs
```

```js
import { decodeIco, encodeIco, isIco } from 'icojs';
```

A UMD bundle is also available for browsers.

```html
<script src="node_modules/icojs/dist/ico.js"></script>
```

## Demo

* Decoder: [https://egy186.github.io/icojs/demo-decoder.html](https://egy186.github.io/icojs/demo-decoder.html)
* Encoder: [https://egy186.github.io/icojs/demo-encoder.html](https://egy186.github.io/icojs/demo-encoder.html)

## Example

### Decoding

Node.js:

```js
import { readFile, writeFile } from 'node:fs/promises';
import { decodeIco } from 'icojs';

const buffer = await readFile('favicon.ico');
const images = await decodeIco(buffer, 'image/png');
// save as png files
images.forEach(image => {
  const file = `${image.width}x${image.height}-${image.bpp}bit.png`;
  const data = Buffer.from(image.buffer);
  writeFile(file, data);
});
```

Browser:

```html
<input type="file" id="input-file" />
<script>
  document.querySelector('#input-file').addEventListener('change', async evt => {
    const file = evt.target.files[0];
    const buffer = await file.arrayBuffer();
    const images = await ICO.decodeIco(buffer);
    // logs images
    console.dir(images);
  });
</script>
```

### Encoding

Node.js:

```js
import { readFile, writeFile } from 'node:fs/promises';
import { encodeIco } from 'icojs';

const buffer1 = await readFile('16x16.png');
const buffer2 = await readFile('32x32.png');
const ico = await encodeIco([
  { buffer: buffer1 },
  { buffer: buffer2 }
]);
// save as a ico file
writeFile('favicon.ico', Buffer.from(ico));
```

Browser:

```html
<input type="file" id="input-file" multiple />
<script>
  document.querySelector('#input-file').addEventListener('change', async evt => {
    const files = Array.from(evt.target.files);
    const iconList = await Promise.all(files.map(async file => {
      const buffer = await file.arrayBuffer();
      return { buffer };
    }));
    const ico = await ICO.encodeIco(iconList);
    // logs ico
    console.dir(ico);
  });
</script>
```

## API Documentation

[https://egy186.github.io/icojs/](https://egy186.github.io/icojs/)
