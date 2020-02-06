(() => {
  "use strict";
  const gulp = require('gulp');
  const del = require("del");
  const browserSync = require('browser-sync').create();
  const sass = require('gulp-sass');
  const postcss = require("gulp-postcss");
  const rename = require("gulp-rename");
  const sourcemaps = require('gulp-sourcemaps');
  const imagemin = require('gulp-imagemin');
  const babel = require('gulp-babel');
  const minify = require('gulp-minify');

  const path = require('path');
  const fs = require('fs');
  const data = require('gulp-data');
  const twig = require('gulp-twig');
  const plumber = require('gulp-plumber');

  const beautify = require('gulp-beautify');
  const removeEmptyLines = require('gulp-remove-empty-lines');

  //Config
  const config = require('./gulp.config')();

  const Clean = () => {
    return del([config.dir.build]);
  };

  const Twig = () => {
    return gulp.src(config.twig.src)
        .pipe(plumber({
          handleError: function (err) {
            process.stderr.write(err.message + '\n');
            this.emit('end');
          }
        }))
        .pipe(data(async function (file) {
          let extension = path.extname(file.path);
          let filename = path.basename(file.path, extension);
          let dataFilename = config.twig.data.src + filename + '.json';

          let exists = await fs.existsSync(dataFilename);

          if(exists) {
            let pageData = await fs.readFileSync(dataFilename);
            return JSON.parse(pageData);
          }
        }))
        .pipe(twig())
        .on('error', function (err) {
          process.stderr.write(err.message + '\n');
          this.emit('end');
        })
        .pipe(beautify.html(config.beautify.html))
        .pipe(removeEmptyLines(config.removeEmptyLines.options))
        .pipe(gulp.dest(config.twig.build))
        .pipe(browserSync.reload(config.browserSync.reload));
  };

  const Image = () => {
    return gulp.src(config.image.src)
      .pipe(imagemin(config.image.imagemin))
      .pipe(gulp.dest(config.image.build))
      .pipe(browserSync.reload(config.browserSync.reload));
  };

  const Css = () => {
    return gulp.src(config.css.src)
      .pipe(sourcemaps.init())
      .pipe(sass(config.css.sass).on('error', sass.logError))
      .pipe(postcss(config.css.postCSS))
      .pipe(rename(function(path) {
        path.basename = path.basename.replace(config.css.rename.prefix, '');
        path.extname = config.css.rename.extname;
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.css.build))
      .pipe(browserSync.reload(config.browserSync.reload));
  };

  const Javascript = () => {
    return gulp.src(config.javascript.src)
      .pipe(babel(config.javascript.babel))
      .pipe(minify(config.javascript.minify))
      .pipe(gulp.dest(config.javascript.build))
      .pipe(browserSync.reload(config.browserSync.reload));
  };

  const Fonts = () => {
    return gulp.src(config.fonts.src)
        .pipe(gulp.dest(config.fonts.build));
  };

  const Watch = () => {
    browserSync.init(config.browserSync.server);

    gulp.watch(config.twig.watch, Twig);
    gulp.watch(config.twig.data.watch, Twig);

    gulp.watch(config.image.watch, Image);
    gulp.watch(config.css.watch, Css);
    gulp.watch(config.javascript.watch, Javascript);
    
    gulp.watch(config.fonts.watch, Fonts);

    gulp.watch([
        config.fonts.watch,
        config.image.watch,
        config.twig.watch,
        config.twig.data.watch
      ])
      .on("change", function () {
        browserSync.reload();
      });
  };

  exports.default = gulp.series(
    Clean,
    Twig,
    Image,
    Css,
    Javascript,
    Fonts,

    Watch
  );

})();
