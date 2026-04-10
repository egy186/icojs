// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import ejs from 'ejs';
import jsonfile from 'jsonfile';
import { marked } from 'marked';

const generateDocs = async () => {
  const markdown = {
    api: await readFile(new URL('../templates/api.md', import.meta.url), 'utf-8'),
    demo: await readFile(new URL('../templates/demo.md', import.meta.url), 'utf-8'),
    example: await readFile(new URL('../templates/example.md', import.meta.url), 'utf-8'),
    foot: await readFile(new URL('../templates/foot.md', import.meta.url), 'utf-8'),
    head: await readFile(new URL('../templates/head.md', import.meta.url), 'utf-8'),
    install: await readFile(new URL('../templates/install.md', import.meta.url), 'utf-8')
  };

  // Generate README.md
  const md = [
    markdown.head,
    markdown.install,
    markdown.example,
    markdown.demo,
    markdown.api,
    markdown.foot
  ].join('\n');
  await writeFile(new URL('../README.md', import.meta.url), md, 'utf-8');

  // Generate docs/index.html
  const template = await readFile(new URL('../templates/index.ejs', import.meta.url), 'utf-8');
  const { version } = await jsonfile.readFile(new URL('../package.json', import.meta.url));
  const html = ejs.render(template, {
    docs: {
      api: marked.parse(markdown.api),
      demo: marked.parse(markdown.demo),
      example: marked.parse(markdown.example),
      install: marked.parse(markdown.install)
    },
    version
  });
  await mkdir(new URL('../docs', import.meta.url));
  await writeFile(new URL('../docs/index.html', import.meta.url), html, 'utf-8');

  // Copy demo
  await cp(new URL('../assets', import.meta.url), new URL('../docs', import.meta.url), {
    recursive: true
  });
  await cp(new URL('../dist/ico.js', import.meta.url), new URL('../docs/ico.js', import.meta.url));
};

generateDocs().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
