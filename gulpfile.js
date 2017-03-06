var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = {
    assetsDir: 'source',
    sassPattern: 'scss/**/*.scss',
    jsPattern: 'javascripts/**/*.js',
    production: !!util.env.production,
    sourceMaps: !util.env.production
};

gulp.task('browser-sync', function() {
    //watch files
    var files = [
        'source/scss/**/*.scss',
        'source/javascript/**/*.js/'
    ];

    //initialize browsersync
    browserSync.init(files, {
        //browsersync with a php server
        proxy: "http://dev.testing.com",
        notify: true
    });
});

gulp.task('sass', function() {
    gulp.src(config.assetsDir + '/' + config.sassPattern)
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('style.min.css'))

    //only uglify if gulp is ran with '--type production'
    .pipe(config.production ? minifyCSS() : util.noop())
        // .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('public/css'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('build-js', function() {
    gulp.src(config.assetsDir + '/' + config.jsPattern)
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(sourcemaps.init())
        .pipe(concat('script.min.js'))

    //only uglify if gulp is ran with '--type production'
    .pipe(config.production ? uglify() : util.noop())
        // .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('public/js'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('watch-dev', ['sass', 'build-js', 'browser-sync'], function() {
    gulp.watch(config.assetsDir + '/' + config.sassPattern, ['sass'])
    gulp.watch(config.assetsDir + '/' + config.jsPattern, ['build-js'])
});

gulp.task('watch', function() {
    gulp.watch(config.assetsDir + '/' + config.sassPattern, ['sass'])
    gulp.watch(config.assetsDir + '/' + config.jsPattern, ['build-js'])
});

gulp.task('default', ['sass', 'watch', 'build-js']);