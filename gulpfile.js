const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const replace = require('gulp-replace');
const cheerio= require('gulp-cheerio');
const sprite = require('gulp-svg-sprite');
const del = require('del');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const ssi =  require('browsersync-ssi')
const buildssi =  require('gulp-ssi')


function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/',
            middleware: ssi({ baseDir: 'app/', ext: '.html'}),
        }, 
        notify: false,
        online: true 
    })
}

function styles() {
    return src('app/scss/style.scss')
      .pipe(scss({ outputStyle: 'expanded'}))
      .pipe(concat('style.min.css'))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version'],
        grid: true
      }))
      .pipe(dest('app/css'))
      .pipe(browserSync.stream()) 
  }

  function scripts() {
      return src([
          'node_modules/jquery/dist/jquery.js',
          'app/js/main.js'
      ])
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(dest('app/js'))
      .pipe(browserSync.stream())
  }

  function images() {
      return src('app/images/**/*.*')
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
      .pipe(dest('dist/images'))
  }

  function svgSprite() {
    return src('app/images/sprite/*.svg')
    .pipe(cheerio({
        run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
        },
        parserOptions: {
            xmlMode: true
        }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(sprite({
        mode: {
            stack: {
                sprite: '../sprite.svg'
            }
        }
    }))
    .pipe(dest('app/images'));
}


  function buildcopy() {
    return src([          
      '{app/js,app/css}/*.min.*',
      'app/images/**/*.*',
      '!app/images/src/**/*',
      'app/fonts/**/*'
    ], {base: 'app'})
    .pipe(dest('dist'))
}


function buildhtml() {
    return src (['app/**/*.html', '!app/components-html/**/*'])
    .pipe(buildssi({ root: 'app/'}))
    .pipe(dest('dist'))
}

function cleanDist() {
    return del('dist/**/*', { force: true })

}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
    watch(['app/**/*.html']).on('change', browserSync.reload)
    watch(['app/images/sprite/*.svg'], svgSprite);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.svgSprite = svgSprite;
exports.build = series(cleanDist, scripts, images, buildcopy, buildhtml);

exports.default = parallel(styles, scripts, svgSprite, browsersync, watching);