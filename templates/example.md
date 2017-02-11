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

