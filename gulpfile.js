(() => {
  "use strict";
  const gulp = require('gulp');
  const del = require("del");
  const browserSync = require('browser-sync').create();
  const uglify = require('gulp-uglifyjs');
  const sass = require('gulp-sass');
  const postcss = require("gulp-postcss");
  const rename = require("gulp-rename");
  const sourcemaps = require('gulp-sourcemaps');
  const imagemin = require('gulp-imagemin');
  const babel = require('gulp-babel');
  const minify = require('gulp-minify');
  const twig = require('gulp-twig');

  //Paths
  const config = require('./gulp.config')();

  const Clean = () => {
    return del([config.dir.build]);
  };

  const Twig = () => {
    return gulp.src(config.twig.src)
        .pipe(twig())
        .pipe(gulp.dest(config.twig.build));
  };

  const Image = () => {
    return gulp.src(config.image.src)
      .pipe(imagemin(config.image.imagemin))
      .pipe(gulp.dest(config.image.build))
      .pipe(browserSync.reload(config.browsersync.reload));
  };

  const Css = () => {
    return gulp.src(config.css.src)
      .pipe(sourcemaps.init())
      .pipe(sass(config.css.sass).on('error', sass.logError))
      .pipe(postcss(config.css.postCSS))
      .pipe(sourcemaps.write())
      .pipe(rename(config.css.outputFilename))
      .pipe(gulp.dest(config.css.build))
      .pipe(browserSync.reload(config.browsersync.reload));
  };

  const Javascript = () => {
    return gulp.src(config.javascript.src)
      .pipe(babel(config.javascript.babel))
      .pipe(minify(config.javascript.minify))
      .pipe(gulp.dest(config.javascript.build))
      .pipe(browserSync.reload(config.browsersync.reload));
  };

  const Fonts = () => {
    return gulp.src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.build));
  };

  const Watch = () => {
    browserSync.init(config.browsersync.server);

    gulp.watch(config.image.watch, Image);
    gulp.watch(config.css.watch, Css);
    gulp.watch(config.javascript.watch, Javascript);
    
    gulp.watch(config.fonts.watch, Fonts);

    gulp.watch(config.twig.watch, Twig);

    gulp.watch([
        config.fonts.watch,
        config.image.watch,
        config.twig.watch
      ])
      .on("change", function () {
        browserSync.reload();
      });
  };

  exports.default = gulp.series(
    Clean,
    Image,
    Css,
    Javascript,
    Fonts,
    Twig,

    Watch
  );

})();
