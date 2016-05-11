////////////////////////////////////////////
// Drifter Gulpfile
// Version 0.2.0
////////////////////////////////////////////

'use strict';

/**
 * Load dependencies
 */
var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    browserSync   = require('browser-sync').create(),
    reload        = browserSync.reload;

/**
 * Configuration
 */
var config = {
  src: {
    sass:       'sass/**/*.scss',
    images:     'images/**/*.{gif,jpg,jpeg,png,svg}',
    templates:  '**/*.html'
  },
  dest: {
    css:        'stylesheets',
    images:     'images',
  },
  autoprefixer: {
    browsers:   ['last 2 versions'],
    cascade:    false,
  },
};


/*----------------------------------------*\
  TASKS
\*----------------------------------------*/

/**
 * Watching files for changes
 */
gulp.task('watch', ['sass'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    notify: false,
    open: false
  });

  gulp.watch(config.src.sass, ['sass']);
  gulp.watch(config.src.templates, reload);
});

/**
 * Compile Sass into CSS
 * Add vendor prefixes with Autoprefixer
 */
gulp.task('sass', function() {
  return gulp.src(config.src.sass)
    .pipe($.sass({
      outputStyle: 'compressed'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(config.autoprefixer))
    .pipe(gulp.dest(config.dest.css))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

/**
 * Optimize images
 */
gulp.task('images', function () {
  return gulp.src(config.src.images)
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(config.dest.images));
});

/**
 * Deploy to Github Pages
 */
gulp.task('deploy', function() {
  return gulp.src(['fonts','images','stylesheets','index.html'])
   .pipe($.ghPages());
});

gulp.task('default', ['watch']);
