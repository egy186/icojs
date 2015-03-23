# icojs

[![Bower version](https://img.shields.io/bower/v/icojs.svg?style=flat)](https://github.com/egy186/icojs)

[![Build Status](https://img.shields.io/travis/egy186/icojs.svg?style=flat)](https://travis-ci.org/egy186/icojs)
[![Coverage Status](https://img.shields.io/coveralls/egy186/icojs.svg?style=flat)](https://coveralls.io/r/egy186/icojs)
[![Code Climate](https://img.shields.io/codeclimate/github/egy186/icojs.svg?style=flat)](https://codeclimate.com/github/egy186/icojs)
[![Dependency Status](https://img.shields.io/david/egy186/icojs.svg?style=flat)](https://david-dm.org/egy186/icojs)

A JavaScript library to use ICO.

Work on both Node.js and Browser.

```js
var fs = require('fs');
var ICO = require('icojs');

var arrayBuffer = new Uint8Array(fs.readFileSync('favicon.ico')).buffer;
var images = ICO.parse(arrayBuffer);
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

To fully use this library, browsers must support **JavaScript typed arrays** and **Canvas API**.

Google Chrome, Internet Explorer 11, Mozilla Firefox and Safari 7.1 support these functions.

## Demo

[http://egy186.github.io/icojs/#demos](http://egy186.github.io/icojs/#demos)

## Documentation

### ICO.parse(buffer)

Parse ICO and return some PNG(s).

#### Parameters

- `buffer` **ArrayBuffer** The ArrayBuffer object contain the TypedArray of a ICO file.

#### Returns

- `images` **Object[]** Array of PNG images.
- `images[].width` **Number** Image width.
- `images[].height` **Number** Image height.
- `images[].bit` **Number** Image bit depth.
- `images[].buffer` **ArrayBuffer** Image buffer.

### ICO.isICO(buffer)

Check the ArrayBuffer is valid ICO.

#### Parameters

- `buffer` **ArrayBuffer** The ArrayBuffer object contain the TypedArray of a ICO file.

#### Returns

- `isICO` **Boolean** True if arg is ICO.

## License

MIT license
