// includes gulp
var gulp = require('gulp');


var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('mocha', function () {
    return gulp.src(['test/**/*.js'], {read: true})
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


gulp.task('data', function () {
    return gulp.src('server/model/connection.js')


});

gulp.task('watch-mocha', function () {
    gulp.watch(['server/model/*.js'], ['mocha']);
    gulp.watch(['server/source/*.js'], ['mocha']);
    gulp.watch(['test/**/*.js'], ['mocha']);

});

gulp.task('default', ['watch-mocha', 'mocha', 'data']);