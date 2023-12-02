import { readFile, writeFile } from 'node:fs/promises';
import jsonfile from 'jsonfile';
import { marked } from 'marked';
import { render } from 'ejs';

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
  const html = render(template, {
    docs: {
      api: marked.parse(markdown.api),
      example: marked.parse(markdown.example),
      install: marked.parse(markdown.install)
    },
    version
  });
  await writeFile(new URL('../docs/index.html', import.meta.url), html, 'utf-8');
};

generateDocs().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
