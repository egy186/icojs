## Example

### Node.js:

```js
const fs = require('fs');
const ICO = require('icojs');

const buffer = fs.readFileSync('favicon.ico');
ICO.parse(buffer, 'image/png').then(images => {
  // save as png files
  images.forEach(image => {
    const file = `${image.width}x${image.height}-${image.bpp}bit.png`;
    const data = Buffer.from(image.data);
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
