# ico.js

[![Bower version](http://img.shields.io/bower/v/icojs.svg?style=flat)](https://github.com/egy186/ico.js) [![Code Climate](http://img.shields.io/codeclimate/github/egy186/ico.js.svg?style=flat)](https://codeclimate.com/github/egy186/ico.js) [![devDependency Status](http://img.shields.io/david/dev/egy186/ico.js.svg?style=flat)](https://david-dm.org/egy186/ico.js#info=devDependencies)

`ico.js` is a JavaScript library to use `ICO`.

## Requirements

To fully use this library, browsers must support **JavaScript typed arrays** and some Web API Interfaces below:

- Canvas
- Blob
- FileReader (optional)
- XMLHttpRequest (optional)

Google Chrome, Internet Explorer 10, Mozilla Firefox and Safari 6 support these function.

## Install

```sh
bower install icojs
```

To use this library in your HTML page, please include `ico.js` or minified `ico.min.js` like this:

```html
<script type="text/javascript" src="/path/to/ico.js"></script>
```

## Demo

[http://egy186.github.io/ico.js/#demos](http://egy186.github.io/ico.js/#demos)

## Documentation

### ico.Parse(buffer, callback)

Parse `ICO` and return some `PNG`(s).

#### Parameters

- `buffer` **ArrayBuffer** The ArrayBuffer object contain the TypedArray of a `ICO` file.
- `callback` **Function** Callback function. callback gets two arguments `(err, pngs)`. `pngs` is like below:

```js
pngs = [
  {
    width: Number width,
    height: Number height,
    data: String dataURI
  },
  ...
]
```

## License

MIT license
