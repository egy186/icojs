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

### Node.js:

```js
import { isICO, parseICO } from 'icojs';
```

### Browser:

```js
import { isICO, parseICO } from 'icojs/browser';
```

or

```html
<script type="text/javascript" src="node_modules/icojs/dist/ico.js"></script>
```

To fully use this library, browsers must support **JavaScript typed arrays**, **Canvas API** and **Promise**.
Chrome, Edge 12, Firefox and Safari 9 support these functions.

## Example

### Node.js:

```js
import { readFile, writeFile } from 'node:fs/promises';
import { parseICO } from 'icojs';

const buffer = await readFile('favicon.ico');
const images = await parseICO(buffer, 'image/png');
// save as png files
images.forEach(image => {
  const file = `${image.width}x${image.height}-${image.bpp}bit.png`;
  const data = Buffer.from(image.buffer);
  writeFile(file, data);
});
```

### Browser:

```html
<input type="file" id="input-file" />
<script>
  document.getElementById('input-file').addEventListener('change', evt => {
    // use FileReader for converting File object to ArrayBuffer object
    var reader = new FileReader();
    reader.onload = async e => {
      const images = await ICO.parseICO(e.target.result);
      // logs images
      console.dir(images);
    };
    reader.readAsArrayBuffer(evt.target.files[0]);
  }, false);
</script>
```

## Demo

[https://egy186.github.io/icojs/#demo](https://egy186.github.io/icojs/#demo)

## API

<a name="module_ICO"></a>

### ICO

* [ICO](#module_ICO)
    * [isICO(source)](#exp_module_ICO--isICO) ⇒ <code>boolean</code> ⏏
    * [parseICO(buffer, [mime])](#exp_module_ICO--parseICO) ⇒ <code>Promise.&lt;Array.&lt;ParsedImage&gt;&gt;</code> ⏏

<a name="exp_module_ICO--isICO"></a>

#### isICO(source) ⇒ <code>boolean</code> ⏏
Check the ArrayBuffer is valid ICO.

**Kind**: global method of [<code>ICO</code>](#module_ICO)  
**Returns**: <code>boolean</code> - True if arg is ICO.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>ArrayBuffer</code> \| <code>Buffer</code> | ICO file data. |

<a name="exp_module_ICO--parseICO"></a>

#### parseICO(buffer, [mime]) ⇒ <code>Promise.&lt;Array.&lt;ParsedImage&gt;&gt;</code> ⏏
Parse ICO and return some images.

**Kind**: global method of [<code>ICO</code>](#module_ICO)  
**Returns**: <code>Promise.&lt;Array.&lt;ParsedImage&gt;&gt;</code> - Resolves to an array of [ParsedImage](#ParsedImage).  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| buffer | <code>ArrayBuffer</code> \| <code>Buffer</code> |  | ICO file data. |
| [mime] | <code>string</code> | <code>&quot;image/png&quot;</code> | MIME type for output. |


## Typedefs

<a name="ParsedImage"></a>

### ParsedImage : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | Image width. |
| height | <code>number</code> | Image height. |
| bpp | <code>number</code> | Image color depth as bits per pixel. |
| buffer | <code>ArrayBuffer</code> | Image buffer. |


## License

MIT license
