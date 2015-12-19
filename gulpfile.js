'use strict';

const execSync = require('child_process').execSync;
const gulp = require('gulp');
const mustache = require('gulp-mustache');

const icojsDoc = JSON.parse(execSync('"node_modules/.bin/jsdoc" src/ico.js -X')).filter(d => {
  return d.memberof === 'ICO' && (!d.access || d.access === 'public');
}).map(d => {
  if (d.params) {
    d.params = d.params.map(param => {
      param.type = param.type.names.join('|');
      return param;
    });
  }
  if (d.returns) {
    d.returns = d.returns.map(rtn => {
      rtn.type = rtn.type.names.join('|');
      return rtn;
    });
  }
  return d;
});

gulp.task('docs', () => {
  return gulp.src('templates/README.md')
    .pipe(mustache(icojsDoc))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['build', 'test', 'docs']);
