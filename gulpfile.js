var gulp = require('gulp');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var jasmine = require('gulp-jasmine');
var browserify = require('gulp-browserify');
var notify = require('gulp-notify');

gulp.task('clean', function() {
  return gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('test', function() {
  gulp.src('spec/*.js')
    .pipe(jasmine());
});

gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(browserify({
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('build/sudokusolver.js'))
    .pipe(notify({message: 'scripts task complete'}));

});

gulp.task('default', ['clean', 'test'], function() {
  gulp.start('scripts');
});

