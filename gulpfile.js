// includes gulp
var gulp = require('gulp');
var stylish = require('jshint-stylish');


var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('sass', function () {
    return gulp.src('./assets/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({style: "compressed"}).on('error', sass.logError))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min',
            basename: 'bootstrap'
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./client/stylesheets'))

});


gulp.task('mocha', function () {
    return gulp.src(['test/**/**/*.js'], {read: true})
        .pipe(mocha({
            reporter: 'spec',           // console output format
            ignoreLeaks: false,         // Leaks
            bail: false,                // bail on first test fail
            timeout: 10000               // timeout for test cases
        }))
        .on('error', gutil.log);
});

gulp.task('sourceTest', function () {
    return gulp.src(['test/**/sourceTest/residentTest.js'], {read: true})
        .pipe(mocha({
            reporter: 'spec',
            ignoreLeaks: false,
            bail: false,
            timeout: 7000
        }));
});

gulp.task('testMappers', function () {
    return gulp.src(['test/**/sourceTest/*.js'], {read: true})
        .pipe(mocha({
            reporter: 'spec',
            ignoreLeaks: false,
            bail: false,
            timeout: 700
        }));
});

gulp.task('lint', function () {
    return gulp.src('test/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});



/**
 * Build Project task
 * compile sass, compress js - moves to client folder
 * */


/**
 * SASS compile task
 * */

gulp.task('compile-sass',function () {
   gulp.watch(['./public/scss/**'],['sass'])
});

/**
 * OLD tasks
 * */
gulp.task('data', function () {
    return gulp.src('server/model/connection.js')
});

gulp.task('watch', function () {
    gulp.watch(['server/source/*.js', 'test/**/*.js', 'server/model/*.js'], ['mocha', 'lint']);
});

gulp.task('watch-account', function () {
    gulp.watch(['test/backendTest/sourceTest/*.js', 'server/source/accountMapper.js', 'server/source/residentMapper.js'], ['sourceTest']);
});

gulp.task('test', ['sourceTest']);

gulp.task('testTransaction', function () {
    gulp.watch(['server/source/*.js', 'test/sourceTest/accountTest.js'], ['sourceTest']);
});


gulp.task('default', ['watch', 'mocha', 'data', 'lint']);
