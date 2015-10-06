// includes gulp
var gulp = require('gulp');
var stylish = require('jshint-stylish');


var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('mocha', function () {
    return gulp.src(['test/**/collectionGet-test.js','test/**/resident-test.js'], {read: true})
        .pipe(mocha({
            reporter: 'spec',           // console output format
            ignoreLeaks: false,         // Leaks
            bail: false,                // bail on first test fail
            timeout: 10000               // timeout for test cases
        }))
        .on('error', gutil.log);
    //.on('close', gutil.log)
    //.on('end', gutil.log)
    //.on('data', gutil.log);

});


gulp.task('lint', function () {
    return gulp.src('test/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('data', function () {
    return gulp.src('server/model/connection.js')

});

gulp.task('watch', function () {
    gulp.watch(['server/source/*.js', 'test/**/*.js', 'server/model/*.js'], ['mocha', 'lint']);

});

gulp.task('default', ['watch', 'mocha', 'data', 'lint']);