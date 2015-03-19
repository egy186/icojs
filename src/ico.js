'use strict';

/**
 * convert ArrayBuffer to 1bit Array
 * @param {ArrayBuffer} buffer
 * @returns {Array}
 */
function to1bitArray (buffer) {
  var buff = new Uint8Array(buffer);
  var bit = '';
  for (var i = 0; i < buff.byteLength; i++) {
    bit += ('000000000' + buff[i].toString(2)).slice(-8);
  }
  return bit.split('').map(function (el) {
    return parseInt(el, 2);
  });
}

/**
 * convert ArrayBuffer to 4bit Array
 * @param {ArrayBuffer} buffer
 * @returns {Array}
 */
function to4bitArray (buffer) {
  var buff = new Uint8Array(buffer);
  var bit = '';
  for (var i = 0; i < buff.byteLength; i++) {
    bit += ('00' + buff[i].toString(16)).slice(-2);
  }
  return bit.split('').map(function (el) {
    return parseInt(el, 16);
  });
}

/**
 * convert ArrayBuffer to 8bit Array
 * @param {ArrayBuffer} buffer
 * @returns {Array}
 */
function to8bitArray (buffer) {
  var buff = new Uint8Array(buffer);
  var bit = [];
  for (var i = 0; i < buff.byteLength; i++) {
    bit.push(buff[i]);
  }
  return bit;
}

/**
 * convert data-URL to ArrayBuffer
 * @param {String} dataURL dataURL string
 * @returns {Object} data
 * @returns {String} data.type data mime-type
 * @returns {ArrayBuffer} data.buffer data buffer
 */
function dataURLToArrayBuffer(dataURL) {
  var string =  window.atob(dataURL.replace(/.+,/, ''));
  var bytes = new Uint8Array(string.length);
  for (var i = 0; i < string.length; i++) {
    bytes[i] = string.charCodeAt(i);
  }
  return {
    type: dataURL.replace(/data:/, '').replace(/;.+/, ''),
    buffer: bytes.buffer
  };
}

/**
 * extract an icon from buffer
 * @param {ArrayBuffer} buffer ico buffer
 * @param {number} index index of icon
 * @returns {Object} ico parsed ico
 * @returns {Number} ico.width image width
 * @returns {Number} ico.height image height
 * @returns {Number} ico.colorCount color count
 * @returns {Number} ico.bit bit depth
 * @returns {Array[]} ico.colors color palette
 * @returns {ArrayBuffer} ico.xor xor image
 * @returns {ArrayBuffer} ico.and xor and
 */
function extractOne (buffer, index) {
  var dv = new DataView(buffer);
  var ico = {
    width: dv.getUint8(6 + index * 16) || 256,
    height: dv.getUint8(7 + index * 16) || 256,
    colorCount: dv.getUint8(8 + index * 16)
  };
  var icoSize = dv.getUint32(14 + index * 16, true);
  var icoOffset = dv.getUint32(18 + index * 16, true);
  var icoBuffer = buffer.slice(icoOffset, icoOffset + icoSize);
  var icoDv = new DataView(icoBuffer);
  var icoHeaderSize = icoDv.getUint32(0, true);
  var icoColorsCount = icoDv.getUint32(32, true);

  ico.bit = icoDv.getUint16(14, true);
  ico.colors = [];
  for (var i = 0; i < icoColorsCount; i++) {
    ico.colors.push(to8bitArray(icoBuffer.slice(icoHeaderSize + i * 4, icoHeaderSize + i * 4 + 4)));
  }
  var icoXorOffset = icoHeaderSize + icoColorsCount * 4;
  var xorLine = ico.width * ico.bit / 8;
  if (xorLine % 4 !== 0) {
    xorLine += 4 - xorLine % 4;
  }
  var icoAndOffset = icoXorOffset + xorLine * ico.height;
  ico.xor = icoBuffer.slice(icoXorOffset, icoAndOffset);
  var andLine = ico.width / 8;
  if (andLine % 4 !== 0) {
    andLine += 4 - andLine % 4;
  }
  ico.and = icoBuffer.slice(icoAndOffset, icoAndOffset + andLine * ico.height);
  return ico;
}

/**
 * check buffer is valid ICO
 * @param {ArrayBuffer} buffer
 * @returns {Boolean} true if valid
 */
var isIco = function (buffer) {
  var icoDv = new DataView(buffer);
  // idReserved = icoDv.getUint16(0, true)
  // idType = icoDv.getUint16(0, true)
  return icoDv.getUint16(0, true) === 0 && icoDv.getUint16(2, true) === 1;
};

/**
 * parse ICO file
 * @param {ArrayBuffer} buffer ico buffer
 * @returns {Object[]} ico Array of parsed ico
 * @returns {Number} ico.bit bit depth
 * @returns {Number} ico.width image width
 * @returns {Number} ico.height image height
 * @returns {String} ico.type image mime-type
 * @returns {ArrayBuffer} ico.buffer image buffer
 */
var Parse = function (buffer) {
  var icoDv = new DataView(buffer);
  if (!isIco(buffer)) {
    throw new Error('Not valid ICO');
  }
  var i, j, k, index;
  // make single image icon
  var icon, color, xorLine, andLine;
  var canvas, ctx, imageData, data;
  var icons = [];
  // var idCount = icoDv.getUint16(4, true);
  for (i = 0; i < icoDv.getUint16(4, true); i++) {
    icon = extractOne(buffer, i);
    icon.and = to1bitArray(icon.and);
    xorLine = icon.width * icon.bit / 8;
    if (xorLine % 4 !== 0) {
      xorLine += 4 - xorLine % 4;
    }
    xorLine *= 8 / icon.bit;
    andLine = icon.width / 8;
    if (andLine % 4 !== 0) {
      andLine += 4 - andLine % 4;
    }
    andLine *= 8;

    canvas = document.createElement('canvas');
    canvas.width = icon.width;
    canvas.height = icon.height;
    ctx = canvas.getContext('2d');
    imageData = ctx.createImageData(canvas.width, canvas.height);
    data = imageData.data;
    switch (icon.bit) {
      case 1:
        icon.xor = to1bitArray(icon.xor);
        index = 0;
        for (j = icon.height - 1; j >= 0; j--) {
          for (k = 0; k < icon.width; k++) {
            color = icon.colors[icon.xor[j * xorLine + k]];
            data[index * 4] = color[2];
            data[index * 4 + 1] = color[1];
            data[index * 4 + 2] = color[0];
            data[index * 4 + 3] = icon.and[j * andLine + k] ? 0 : 255;
            index++;
          }
        }
        break;
      case 4:
        icon.xor = to4bitArray(icon.xor);
        index = 0;
        for (j = icon.height - 1; j >= 0; j--) {
          for (k = 0; k < icon.width; k++) {
            color = icon.colors[icon.xor[j * xorLine + k]];
            data[index * 4] = color[2];
            data[index * 4 + 1] = color[1];
            data[index * 4 + 2] = color[0];
            data[index * 4 + 3] = icon.and[j * andLine + k] ? 0 : 255;
            index++;
          }
        }
        break;
      case 8:
        icon.xor = to8bitArray(icon.xor);
        index = 0;
        for (j = icon.height - 1; j >= 0; j--) {
          for (k = 0; k < icon.width; k++) {
            color = icon.colors[icon.xor[j * xorLine + k]];
            data[index * 4] = color[2];
            data[index * 4 + 1] = color[1];
            data[index * 4 + 2] = color[0];
            data[index * 4 + 3] = icon.and[j * andLine + k] ? 0 : 255;
            index++;
          }
        }
        break;
      case 24:
        icon.xor = to8bitArray(icon.xor);
        index = 0;
        for (j = icon.height - 1; j >= 0; j--) {
          for (k = 0; k < icon.width; k++) {
            data[index * 4] = icon.xor[(j * xorLine + k) * 3 + 2];
            data[index * 4 + 1] = icon.xor[(j * xorLine + k) * 3 + 1];
            data[index * 4 + 2] = icon.xor[(j * xorLine + k) * 3];
            data[index * 4 + 3] = icon.and[j * andLine + k] ? 0 : 255;
            index++;
          }
        }
        break;
      case 32:
        icon.xor = to8bitArray(icon.xor);
        index = 0;
        for (j = icon.height - 1; j >= 0; j--) {
          for (k = 0; k < icon.width; k++) {
            data[index * 4] = icon.xor[(j * xorLine + k) * 4 + 2];
            data[index * 4 + 1] = icon.xor[(j * xorLine + k) * 4 + 1];
            data[index * 4 + 2] = icon.xor[(j * xorLine + k) * 4];
            data[index * 4 + 3] = (icon.and[j * andLine + k] === 1 || icon.xor[(j * xorLine + k) * 4 + 3] === 1) ? 0 : (icon.xor[(j * xorLine + k) * 4 + 3] > 1 ? icon.xor[(j * xorLine + k) * 4 + 3] : 255);
            index++;
          }
        }
        break;
    }
    ctx.putImageData(imageData, 0, 0);
    icon.imageData = imageData;
    var png = dataURLToArrayBuffer(canvas.toDataURL());
    icons.push({
      bit: icon.bit,
      width: icon.width,
      height: icon.height,
      type: png.type,
      buffer: png.buffer
    });
  }
  return icons;
};

window.ico = {
  Parse: Parse,
  isIco: isIco
};
