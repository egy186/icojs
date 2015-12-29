# icojs

[![Bower version](https://img.shields.io/bower/v/icojs.svg)](https://github.com/egy186/icojs)
[![npm version](https://img.shields.io/npm/v/icojs.svg)](https://www.npmjs.com/package/icojs)

[![Build Status](https://img.shields.io/travis/egy186/icojs.svg)](https://travis-ci.org/egy186/icojs)
[![Coverage Status](https://img.shields.io/coveralls/egy186/icojs.svg)](https://coveralls.io/r/egy186/icojs)
[![Code Climate](https://img.shields.io/codeclimate/github/egy186/icojs.svg)](https://codeclimate.com/github/egy186/icojs)
[![Dependency Status](https://img.shields.io/david/egy186/icojs.svg)](https://david-dm.org/egy186/icojs)

A JavaScript library to use ICO.

Work on both Node.js and Browser.

```js
var fs = require('fs');
var ICO = require('icojs');

var arrayBuffer = new Uint8Array(fs.readFileSync('favicon.ico')).buffer;
ICO.parse(arrayBuffer).then(images => {
  // do something
});
```

## Install

### Node.js:

```sh
npm install icojs
```

### Browser:

```sh
bower install icojs
```

And add to HTML:

```html
<script type="text/javascript" src="/path/to/ico.js"></script>
```

To fully use this library, browsers must support **JavaScript typed arrays**, **Canvas API** and **Promise**.

Chrome, Edge 12, Firefox and Safari 9 support these functions.

## Demo

[http://egy186.github.io/icojs/#demo](http://egy186.github.io/icojs/#demo)

<a name="ICO"></a>
## Documentation

* [ICO](#ICO)
    * [.parse(buffer)](#ICO.parse) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.isICO(buffer)](#ICO.isICO) ⇒ <code>Boolean</code>
    * [.noConflict()](#ICO.noConflict) ⇒ <code>[ICO](#ICO)</code>

<a name="ICO.parse"></a>
### ICO.parse(buffer) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
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
