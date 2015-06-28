/// <vs AfterBuild='default' />

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var coveralls = require('gulp-coveralls');
var del = require('del');
var execSync = require('child_process').execSync;
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var mustache = require('gulp-mustache');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var icojsDoc = JSON.parse(execSync('"node_modules/.bin/jsdoc" src/ico.js -X')).filter(function (d) {
  return d.memberof === 'ICO' && (!d.access || d.access === 'public');
}).map(function (d) {
  if (d.params) {
    d.params = d.params.map(function (param) {
      param.type = param.type.names.join('|');
      return param;
    });
  }
  if (d.returns) {
    d.returns = d.returns.map(function (rtn) {
      rtn.type = rtn.type.names.join('|');
      return rtn;
    });
  }
  return d;
});

gulp.task('lint', function () {
  return gulp.src(['gulpfile.js', 'src/**/*.js', 'test/*.js', 'test/data/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', function () {
  var destPath = 'dist';
  del.sync(destPath);
  var b = browserify({
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

gulp.task('docs', function () {
  return gulp.src('templates/README.md')
    .pipe(mustache(icojsDoc))
    .pipe(gulp.dest('.'));
});

gulp.task('coveralls', ['test'], function () {
  return gulp.src('test/coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('default', ['lint', 'build', 'test', 'docs']);
gulp.task('ci', ['default', 'coveralls']);
