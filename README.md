# icojs

[![npm](https://img.shields.io/npm/v/icojs.svg)](https://www.npmjs.com/package/icojs)
[![Build Status](https://travis-ci.org/egy186/icojs.svg?branch=master)](https://travis-ci.org/egy186/icojs)
[![dependencies Status](https://david-dm.org/egy186/icojs/status.svg)](https://david-dm.org/egy186/icojs)
[![Coverage Status](https://coveralls.io/repos/github/egy186/icojs/badge.svg?branch=master)](https://coveralls.io/github/egy186/icojs?branch=master)
[![codebeat badge](https://codebeat.co/badges/85bd457f-39b6-43d8-bf8e-c80ace07a8d7)](https://codebeat.co/projects/github-com-egy186-icojs)

A JavaScript library to use ICO.
Work on both Node.js and Browser.

## Install

```sh
npm install icojs
```

### Node.js:

```js
const ICO = require('icojs');
```

### Browser:

```js
const ICO = require('icojs/browser')
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
const fs = require('fs');
const ICO = require('icojs');

const buffer = fs.readFileSync('favicon.ico');
ICO.parse(buffer, 'image/png').then(images => {
  // save as png files
  images.forEach(image => {
    const file = `${image.width}x${image.height}-${image.bit}bit.png`;
    const data = Buffer.from(image.buffer);
    fs.writeFileSync(file, data);
  });
});
```

### Browser:

```html
<input type="file" id="input-file" />
<script>
  document.getElementById('input-file').addEventListener('change', function (evt) {
    // use FileReader for converting File object to ArrayBuffer object
    var reader = new FileReader();
    reader.onload = function (e) {
      ICO.parse(e.target.result).then(function (images) {
        // logs images
        console.dir(images);
      })
    };
    reader.readAsArrayBuffer(evt.target.files[0]);
  }, false);
</script>
```

## Demo

[https://egy186.github.io/icojs/#demo](https://egy186.github.io/icojs/#demo)

## Documentation

<a name="ICO"></a>

* [ICO](#ICO)
    * [.noConflict()](#ICO.noConflict) ⇒ <code>[ICO](#ICO)</code>
    * [.isICO(buffer)](#ICO.isICO) ⇒ <code>Boolean</code>
    * [.parse(buffer, [mime])](#ICO.parse) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>

<a name="ICO.noConflict"></a>

### ICO.noConflict() ⇒ <code>[ICO](#ICO)</code>
No conflict.

**Kind**: static method of <code>[ICO](#ICO)</code>  
**Returns**: <code>[ICO](#ICO)</code> - `ICO` Object.  
<a name="ICO.isICO"></a>

### ICO.isICO(buffer) ⇒ <code>Boolean</code>
Check the ArrayBuffer is valid ICO.

**Kind**: static method of <code>[ICO](#ICO)</code>  
**Returns**: <code>Boolean</code> - True if arg is ICO.  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>ArrayBuffer</code> \| <code>Buffer</code> | ICO file data. |

<a name="ICO.parse"></a>

### ICO.parse(buffer, [mime]) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Parse ICO and return some images.

**Kind**: static method of <code>[ICO](#ICO)</code>  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - Resolves to array of parsed ICO.
  * `width` **Number** - Image width.
  * `height` **Number** - Image height.
  * `bit` **Number** - Image bit depth.
  * `buffer` **ArrayBuffer** - Image buffer.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| buffer | <code>ArrayBuffer</code> \| <code>Buffer</code> |  | ICO file data. |
| [mime] | <code>String</code> | <code>image/png</code> | MIME type for output. |


## License

MIT license
