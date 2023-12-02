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
