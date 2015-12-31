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
const fs = require('fs');
const ICO = require('icojs');

const arrayBuffer = new Uint8Array(fs.readFileSync('favicon.ico')).buffer;
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

[https://egy186.github.io/icojs/#demo](https://egy186.github.io/icojs/#demo)

<a name="ICO"></a>
## Documentation
{{#class name="ICO"~}}
{{>member-index~}}
{{>members~}}
{{/class}}

## License

MIT license
