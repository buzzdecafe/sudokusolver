var gulp = require('gulp');
var concat = require('gulp-concat');
var util = require('gulp-util');
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
  gulp.src('src/js/*')
    .pipe(jshint());                
  gulp.src('spec/*.js')
    .pipe(jasmine());
});

gulp.task('scripts', function() {
  gulp.src('src/js/*.js')
    .pipe(browserify({debug: true}))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build/js'))
//    .pipe(notify('scripts task complete'));
});

gulp.task('files', function() {
  gulp.src('src/sudoku.html')
    .pipe(gulp.dest('build'))
//    .pipe(notify({message: 'html file copied to build dir'}));

  gulp.src('src/css/style.css')
    .pipe(gulp.dest('build/css'))
//    .pipe(notify({message: 'css file copied to build dir'}));
});

gulp.task('default', ['clean', 'test'], function() {
  gulp.start('scripts');
  gulp.start('files');
});


