# icojs

[![npm version](https://img.shields.io/npm/v/icojs.svg)](https://www.npmjs.com/package/icojs)
[![Build Status](https://img.shields.io/travis/egy186/icojs.svg)](https://travis-ci.org/egy186/icojs)
[![Coverage Status](https://img.shields.io/coveralls/egy186/icojs.svg)](https://coveralls.io/r/egy186/icojs)
[![Code Climate](https://img.shields.io/codeclimate/github/egy186/icojs.svg)](https://codeclimate.com/github/egy186/icojs)
[![Dependency Status](https://img.shields.io/david/egy186/icojs.svg)](https://david-dm.org/egy186/icojs)

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

const arrayBuffer = new Uint8Array(fs.readFileSync('favicon.ico')).buffer;
ICO.parse(arrayBuffer).then(images => {
  // do something
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
    * [.parse(buffer, mime)](#ICO.parse) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.isICO(buffer)](#ICO.isICO) ⇒ <code>Boolean</code>
    * [.noConflict()](#ICO.noConflict) ⇒ <code>[ICO](#ICO)</code>

<a name="ICO.parse"></a>

### ICO.parse(buffer, mime) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Parse ICO and return some PNGs.

**Kind**: static method of <code>[ICO](#ICO)</code>  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - Resolves to array of parsed ICO.
  * `width` **Number** - Image width.
  * `height` **Number** - Image height.
  * `bit` **Number** - Image bit depth.
  * `buffer` **ArrayBuffer** - Image buffer.  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>ArrayBuffer</code> | The ArrayBuffer object contain the TypedArray of a ICO file. |
| mime | <code>String</code> | Mime type for output. |

<a name="ICO.isICO"></a>

### ICO.isICO(buffer) ⇒ <code>Boolean</code>
Check the ArrayBuffer is valid ICO.

**Kind**: static method of <code>[ICO](#ICO)</code>  
**Returns**: <code>Boolean</code> - True if arg is ICO.  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>ArrayBuffer</code> | The ArrayBuffer object contain the TypedArray of a ICO file. |

<a name="ICO.noConflict"></a>

### ICO.noConflict() ⇒ <code>[ICO](#ICO)</code>
No conflict.

**Kind**: static method of <code>[ICO](#ICO)</code>  
**Returns**: <code>[ICO](#ICO)</code> - `ICO` Object.  

## License

MIT license
