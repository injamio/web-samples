/**
 * Import gulp modules:
 */
const gulp = require("gulp");
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const postcss = require("gulp-postcss");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const util = require("gulp-util");

/**
 * Import modules:
 */
const cssnano = require("cssnano");
const getcolor = require("postcss-get-color");
const atImport = require("postcss-import-url");
const mqpacker = require("css-mqpacker");
const nunjucksRender = require("gulp-nunjucks-render");

/**
 * Initial Properties
 */
const appName = 'injam.samples';
const dirs = {
    src: 'src',
    dest: 'dist',
    libs: 'node_modules'
};
const processors = [
    atImport(),
    getcolor(),
    mqpacker(),
    cssnano(/*{zindex: false}*/)
];

/**
 * gulp:tasks
 */
gulp.task('scripts', () => {
    return gulp.src([
        // `${dirs.libs}/path/to/sample.js`,
        `${dirs.src}/js/**/*.js`
    ])
        .pipe(sourcemaps.init({ loadMaps: true }))
        .on('error', util.log)
        .pipe(browserify({
            debug: !gulp.env.production
        }))
        // .pipe(uglify())
        .pipe(concat(`${appName}.js`))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${dirs.dest}/js/`));
});

gulp.task('styles', () => {
    return gulp.src(`${dirs.src}/scss/*.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 6 versions', 'ie 8']
        }))
        .pipe(postcss(processors))
        .pipe(concat(`${appName}.css`))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${dirs.dest}/css/`));
});

gulp.task('templates', () => {
    return gulp.src(`${dirs.src}/templates/*.html`)
        .pipe(nunjucksRender({
            path: [`${dirs.src}/`]
        }))
        .pipe(gulp.dest(`${dirs.dest}`));
});

gulp.task('watching', () => {
    gulp.watch(`${dirs.src}/js/**/*.js`, ['scripts']);
    gulp.watch(`${dirs.src}/scss/**/*.scss`, ['styles']);
    gulp.watch(`${dirs.src}/templates/**/*.html`, ['templates']);
});

/**
 * Register Tasks:
 */
gulp.task('default', ['scripts', 'styles', 'templates']);
gulp.task('watch', ['scripts', 'styles', 'templates', 'watching']);