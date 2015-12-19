'use strict';

const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const del = require('del');
const execSync = require('child_process').execSync;
const gulp = require('gulp');
const mustache = require('gulp-mustache');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

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

gulp.task('build', () => {
  const destPath = 'dist';
  del.sync(destPath);
  const b = browserify({
    entries: './src/ico.js',
    debug: true
  }).exclude('canvas').exclude('buffer');
  return b.bundle()
    .pipe(source('ico.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destPath));
});

gulp.task('docs', () => {
  return gulp.src('templates/README.md')
    .pipe(mustache(icojsDoc))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['build', 'test', 'docs']);
