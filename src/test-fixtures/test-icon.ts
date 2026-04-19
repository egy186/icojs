import { loadFile } from './util.js';

interface TestIcon {
  readonly buffer: Readonly<ArrayBuffer>;
  readonly iconList: ReadonlyArray<{
    readonly width: number;
    readonly height: number;
    readonly bpp: number;
    readonly buffer: Readonly<ArrayBuffer>;
    readonly hotspot?: {
      readonly x: number;
      readonly y: number;
    };
  }>;
}

const testIcon = {
  /* eslint-disable @typescript-eslint/naming-convention */
  'basic.ico': {
    buffer: await loadFile('basic.ico'),
    iconList: [
      {
        bpp: 1,
        buffer: await loadFile('basic/16x16-1bit.png'),
        height: 16,
        width: 16
      },
      {
        bpp: 4,
        buffer: await loadFile('basic/32x32-4bit.png'),
        height: 32,
        width: 32
      },
      {
        bpp: 8,
        buffer: await loadFile('basic/48x48-8bit.png'),
        height: 48,
        width: 48
      },
      {
        bpp: 24,
        buffer: await loadFile('basic/96x96-24bit.png'),
        height: 96,
        width: 96
      },
      {
        bpp: 4,
        buffer: await loadFile('basic/256x256-4bit.png'),
        height: 256,
        width: 256
      },
      {
        bpp: 4,
        buffer: await loadFile('basic/5x32-4bit.png'),
        height: 32,
        width: 5
      },
      {
        bpp: 32,
        buffer: await loadFile('basic/32x32-32bit.png'),
        height: 32,
        width: 32
      }
    ]
  },
  'cursor.cur': {
    buffer: await loadFile('cursor.cur'),
    iconList: [
      {
        bpp: 32,
        buffer: await loadFile('cursor/48x48-32bit.png'),
        height: 48,
        hotspot: {
          x: 2,
          y: 10
        },
        width: 48
      },
      {
        bpp: 32,
        buffer: await loadFile('cursor/32x32-32bit.png'),
        height: 32,
        hotspot: {
          x: 2,
          y: 7
        },
        width: 32
      }
    ]
  },
  'palette.ico': {
    buffer: await loadFile('palette.ico'),
    iconList: [
      {
        bpp: 4,
        buffer: await loadFile('palette/32x32-4bit.png'),
        height: 32,
        width: 32
      }
    ]
  },
  'png.ico': {
    buffer: await loadFile('png.ico'),
    iconList: [
      {
        bpp: 32,
        buffer: await loadFile('png/256x256-32bit.png'),
        height: 256,
        width: 256
      }
    ]
  }
  /* eslint-enable @typescript-eslint/naming-convention */
} as const satisfies { readonly [name: string]: TestIcon };

export { testIcon };

export default testIcon;
