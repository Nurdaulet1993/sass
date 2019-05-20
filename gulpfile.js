// Подключение пакетов
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
var sass = require('gulp-sass');

const sassFiles = [
    './src/scss/variables.scss',
    './src/scss/vendor/fonts.scss',
    './src/scss/vendor/reset.scss',
    './src/scss/components/header.scss',
];

const jsFiles = [
    './src/js/main.js'
]

function sassStyle() {
    return gulp.src(sassFiles)
    .pipe(concat('style.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8', level: 2}))
    // .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(jsFiles)
    .pipe(concat('all.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify({toplevel: true}))
    .pipe(gulp.dest('./assets/js'))
    .pipe(browserSync.stream());
}

function clean() {
    return del(['build/*']);
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch("./src/scss/**/*.scss").on('change', sassStyle, browserSync.reload);
}

gulp.task('sass', sassStyle);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);

gulp.task('build', gulp.series(gulp.parallel(sassStyle, scripts)));
gulp.task('dev', gulp.series('build', 'watch'));