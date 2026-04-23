const isBrowser = (): boolean => 'window' in globalThis;

// Load image file as a buffer
const loadFile = async (path: string): Promise<ArrayBuffer> => {
  if (isBrowser()) {
    const res = await fetch(`/src/test-fixtures/images/${path}`);
    return await res.arrayBuffer();
  }

  const { readFile } = await import('node:fs/promises');

  const buffer = await readFile(new URL(`./images/${path}`, import.meta.url));
  return buffer.buffer;
};

export { isBrowser, loadFile };
