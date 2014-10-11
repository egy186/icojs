'use strict';

// ref: http://msdn.microsoft.com/en-us/library/ms997538.aspx
// ICO = {
//   iconDir: ICONDIR,
//   iconImages: [ ICONIMAGE ]
// }
// ICONDIR = {
//   idReserved: 0, // Reserved (must be 0)
//   idType: 1, // Resource Type (1 for icons)
//   idCount: Number,
//   idEntries: [ ICONDIRENTRY ]
// },
// ICONDIRENTRY = {
//   bWidth: Number,
//   bHeight: Number,
//   bColorCount: Number,
//   bReserved: 0, // Reserved ( must be 0)
//   wPlanes: Number,
//   wBitCount: Number,
//   dwBytesInRes: Number,
//   dwImageOffset: Number
// }
// ICONIMAGE = {
//   BitmapInfoHeader: {
//     biSize: Number,
//     biWidth: Number,
//     biHeight: Number,
//     biPlanes: Number,
//     biBitCount: Number,
//     biCompression: Number,
//     biSizeImage: Number,
//     biXPelsPerMeter: 0, // unused
//     biYPelsPerMeter: 0, // unused
//     biClrUsed: Number,
//     biClrImportant: Number
//   },
//   RgbQuad: [{
//     rgbBlue: Number,
//     rgbGreen: Number,
//     rgbRed: Number,
//     rgbReserved: 0 // Reserved
//   }],
//   icXOR: ArrayBuffer,
//   icAND: ArrayBuffer
// }

/**
 * @typedef ico~pngs
 * @type {object[]}
 * @property {string} data dataURL
 * @property {number} width
 * @property {number} height
 */

/**
 * ico.Parse callback
 * @callback ico~parseCallback
 * @param {object} err
 * @param {ico~pngs} pngs
 */

/**
 * parse ICO file
 * @memberof ico
 * @param {ArrayBuffer} buffer
 * @param {ico~parseCallback} callback
 */
var Parse = function (buffer, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError(typeof callback + ' is not a function');
  }
  var dv = new DataView(buffer);
  // check dv is valid ICO
  // idReserved = dv.getUint16(0, true)
  // idType = dv.getUint16(0, true)
  if (dv.getUint16(0, true) !== 0 || dv.getUint16(2, true) !== 1) {
    if (dv.getUint16(0, true) === 0 && dv.getUint16(2, true) === 0) {
      return callback(new Error('Not ICO but CUR'));
    } else {
      return callback(new Error('Not valid ICO'));
    }
  }
  // valid ICO
  var idCount = dv.getUint16(4, true);
  // parse ICONDIRENTRY
  var ides = [];
  for (var i = 0; i < idCount; i++) {
    ides.push({
      bWidth: dv.getUint8(6 + i * 16) || 256,
      bHeight: dv.getUint8(7 + i * 16) || 256,
      //bColorCount: dv.getUint8(8 + i * 16),
      //bReserved: dv.getUint8(9 + i * 16),
      //wPlanes: dv.getUint16(10 + i * 16, true),
      //wBitCount: dv.getUint16(12 + i * 16, true),
      dwBytesInRes: dv.getUint32(14 + i * 16, true),
      dwImageOffset: dv.getUint32(18 + i * 16, true)
    });
  }
  // make single image icon
  var icons = [];
  for (var i = 0; i < idCount; i++) {
    icons.push(singleICON(buffer.slice(6 + 16 * i, 22 + 16 * i), buffer.slice(ides[i].dwImageOffset, ides[i].dwImageOffset + ides[i].dwBytesInRes)));
  }
  // load as <img>
  // call allLoaded
  var loaded = 0;
  var imageElms = [];
  for (var i = 0; i < idCount; i++) {
    imageElms.push(new Image());
    imageElms[i].onload = function () {
      loaded++;
      if (loaded === idCount) {
        ico2png(ides, imageElms, callback);
      }
    };
    imageElms[i].src = window.URL.createObjectURL(new Blob([icons[i]]));
  }
};

/**
 * ICO 2 PNG via Canvas
 * @memberof ico
 * @private
 * @param {object[]} ides ICONDIRENTRY[]
 * @param {object[]} imgs HTMLImageElement[]
 * @param {ico~parseCallback} callback
 */
function ico2png(ides, imgs, callback) {
  var pngs = [];
  for (var i = 0; i < imgs.length; i++) {
    var canvas = document.createElement('canvas');
    canvas.width = ides[i].bWidth;
    canvas.height = ides[i].bHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(imgs[i], 0, 0);
    pngs.push({
      data: canvas.toDataURL(),
      width: ides[i].bWidth,
      height: ides[i].bHeight
    });
  }
  return callback(null, pngs);
}

/**
 * build single image ICO
 * @memberof ico
 * @private
 * @param {ArrayBuffer} ICONDIRENTRY
 * @param {ArrayBuffer} ICONIMAGE
 * @returns {ArrayBuffer} ICO that contain single image
 */
function singleICON(ICONDIRENTRY, ICONIMAGE) {
  var ico = new Uint8Array(6 + ICONDIRENTRY.byteLength + ICONIMAGE.byteLength);
  ico.set(new Uint8Array(ICONDIRENTRY), 6);
  ico.set(new Uint8Array(ICONIMAGE), 6 + ICONDIRENTRY.byteLength);
  var icoDv = new DataView(ico.buffer);
  icoDv.setUint16(2, 1, true);
  icoDv.setUint16(4, 1, true);
  icoDv.setUint32(14, ICONIMAGE.byteLength, true);
  icoDv.setUint32(18, 22, true);
  return ico.buffer;
}

/** @namespace ico */
window.ico = {
  Parse: Parse
};
