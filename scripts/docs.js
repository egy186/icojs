'use strict';

const fs = require('fs/promises');
const jsonfile = require('jsonfile');
const { marked } = require('marked');
const path = require('path');
const { render } = require('ejs');

const generateDocs = async () => {
  const markdown = {
    api: await fs.readFile(path.resolve(__dirname, '../templates/api.md'), 'utf-8'),
    demo: await fs.readFile(path.resolve(__dirname, '../templates/demo.md'), 'utf-8'),
    example: await fs.readFile(path.resolve(__dirname, '../templates/example.md'), 'utf-8'),
    foot: await fs.readFile(path.resolve(__dirname, '../templates/foot.md'), 'utf-8'),
    head: await fs.readFile(path.resolve(__dirname, '../templates/head.md'), 'utf-8'),
    install: await fs.readFile(path.resolve(__dirname, '../templates/install.md'), 'utf-8')
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
  await fs.writeFile(path.resolve(__dirname, '../README.md'), md, 'utf-8');

  // Generate docs/index.html
  const template = await fs.readFile(path.resolve(__dirname, '../templates/index.ejs'), 'utf-8');
  const { version } = await jsonfile.readFile(path.resolve(__dirname, '../package.json'));
  const html = render(template, {
    docs: {
      api: marked.parse(markdown.api),
      example: marked.parse(markdown.example),
      install: marked.parse(markdown.install)
    },
    version
  });
  await fs.writeFile(path.resolve(__dirname, '../docs/index.html'), html, 'utf-8');
};

generateDocs().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
