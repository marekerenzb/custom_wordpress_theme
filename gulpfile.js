var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

var config = {
    assetsDir: 'source',
    sassPattern: 'scss/**/*.scss',
    jsPattern: 'javascripts/**/*.js',
    production: !!util.env.production,
    sourceMaps: !util.env.production
};

gulp.task('sass', function() {
    gulp.src(config.assetsDir + '/' + config.sassPattern)
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('style.min.css'))

    //only uglify if gulp is ran with '--type production'
    .pipe(config.production ? minifyCSS() : util.noop())
        // .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('public/css'));
});

gulp.task('build-js', function() {
    gulp.src(config.assetsDir + '/' + config.jsPattern)
        .pipe(gulpif(config.sourceMaps, sourcemaps.init()))
        .pipe(sourcemaps.init())
        .pipe(concat('script.min.js'))

    //only uglify if gulp is ran with '--type production'
    .pipe(config.production ? uglify() : util.noop())
        // .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
    gulp.watch(config.assetsDir + '/' + config.sassPattern, ['sass'])
    gulp.watch(config.assetsDir + '/' + config.jsPattern, ['build-js'])
});

gulp.task('default', ['sass', 'watch', 'build-js']);