/**
 * Created by Varun Gupta on 12/09/16.
 */

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
// var watch = require('gulp-watch');
var gulpif = require('gulp-if');
var sprity = require('sprity');
var useref = require('gulp-useref');
var minify = require('gulp-minify');
var browserSync = require('browser-sync').create();
var argv = require('yargs').argv; // for args parsing
var spawn = require('child_process').spawn;
var jshint = require('gulp-jshint');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var angularTemplates = require('gulp-angular-templates');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');

//Get Logs..
gulp.task('log', function () {
    console.log('Files has been changed');
});

//Browser Sync
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})

//Minify Task..
gulp.task('compress', function () {
    gulp.src('lib/*.js')
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('dist'))
});

// Lint Task
gulp.task('lint', function () {
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function () {
    return gulp.src('scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/scss'));
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src('js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Compile Our CSS
gulp.task('minify-css', function () {
    return gulp.src('css/**/*.css')
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('images', function () {
    return gulp.src('img/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            // Setting interlaced to true
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

// generate sprite.png and _sprite.scss
gulp.task('sprites', function () {
    return sprity.src({
            src: 'img/**/*.{png,jpg}',
            style: 'sprite.css',
            // ... other optional options
            // for example if you want to generate scss instead of css
            processor: 'sass', // make sure you have installed sprity-sass
        })
        .pipe(gulpif('*.png', gulp.dest('dist/img/'), gulp.dest('dist/css/')))
});

gulp.task('html', function () {
    return gulp.src('views/**/*.html')
        .pipe(angularTemplates())
        .pipe(gulp.dest('./build/'));
});

gulp.task('fonts', function () {
    return gulp.src('fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function () {
    return del.sync('dist');
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('js/**/*.js', ['lint', 'scripts', 'log']);
    gulp.watch('scss/**/*.scss', ['sass', 'log']);
    gulp.watch('css/**/*.css', ['minify-css', 'log']);
    gulp.watch('views/**/*.html', ['html', 'log']);
    gulp.watch('fonts/**/*', ['fonts', 'log']);
});

gulp.task('auto-reload', function () {
    var p;

    gulp.watch('gulpfile.js', spawnChildren);
    spawnChildren();

    function spawnChildren(e) {
        // kill previous spawned process
        if (p) {
            p.kill();
        }

        // `spawn` a child `gulp` process linked to the parent `stdio`
        p = spawn('gulp', [argv.task], {stdio: 'inherit'});
    }
});

// Default Task
gulp.task('default', ['lint', 'minify-css', 'sass', 'scripts', 'html', 'images', 'sprites', 'fonts', 'clean:dist', 'watch']);