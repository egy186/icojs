/// <vs AfterBuild='default' />

/* jshint node: true */

'use strict';

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var coveralls = require('gulp-coveralls');
var del = require('del');
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('jshint', function () {
  gulp.src(['src/*.js', 'test/*.js', 'gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('build', function () {
  var destPath = 'dist';
  del.sync(destPath);
  browserify('./src/ico.js').exclude('canvas').exclude('buffer').bundle()
    .pipe(source('ico.js'))
    .pipe(buffer())
    .pipe(gulp.dest(destPath))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename('ico.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destPath));
});

gulp.task('test', function (callback) {
  var destPath = 'test/coverage';
  del.sync(destPath);
  gulp.src('src/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src('test/test.js')
        .pipe(mocha())
        .pipe(istanbul.writeReports({
          dir: destPath,
          reporters: ['lcov']
        }))
        .on('end', callback);
    });
});

gulp.task('coveralls', ['test'], function () {
  return gulp.src('test/coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('default', ['jshint', 'build', 'test']);
gulp.task('ci', ['default', 'coveralls']);
