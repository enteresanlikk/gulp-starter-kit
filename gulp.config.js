const pngquant = require('imagemin-pngquant');

module.exports = () => {
  const root = './';
  const dir = {
    src: root + 'assets/',
    build: root + 'build/',
    assets: root + 'build/assets/'
  };

  const image = {
    src: dir.src + 'img/**/*',
    watch: dir.src + 'img/**/*',
    build: dir.assets + 'img',
    imagemin: {
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }
  };

  const css = {
    src: [
      dir.src + 'css/**/*.scss'
    ],
    watch: dir.src + 'css/**/*.scss',
    build: dir.assets + 'css',

    outputFilename: "style.min.css",
    sass: {
      outputStyle: "compressed",
      imagePath: dir.assets + "img/",
      precision: 10,
      errLogToConsole: true
    },

    postCSS: [
      require("postcss-assets")({
        relative: true,
        basePath: dir.assets,
        cachebuster: true,
        loadPaths: ["img/"]
      }),
      require("autoprefixer")({
        overrideBrowserslist: [
          "ie >= 10",
          "ie_mob >= 10",
          "ff >= 30",
          "chrome >= 34",
          "safari >= 7",
          "opera >= 23",
          "ios >= 7",
          "android >= 4.4",
          "bb >= 10"
        ]
      }),
      require("cssnano")
    ]
  };

  const javascript = {
    src: dir.src + 'js/**/*.js',
    watch: dir.src + 'js/**/*.js',
    build: dir.assets + 'js',

    babel: {
      presets: ['@babel/env']
    },

    minify: {
      ext:{
        min:'.min.js'
      }
    }
  };

  const html = {
    watch: root + 'html/**/*.html'
  };

  const fileinclude = {
    src: root + 'html/pages/**/*.html',
    build: dir.build,
    watch: root + 'html/**/*.html',
    
    config: {
      prefix: '@@',
      basepath: '@file'
    }
  };

  const fonts = {
    src: dir.src + 'fonts/**/*',
    watch: dir.src + 'fonts/**/*',
    build: dir.assets + 'fonts',
  }

  const browsersync = {
    server: {
      server: {
        baseDir: dir.build,
        index: 'index.html'
      },
      open: false,
      port: 3000
    },

    reload: {
      stream: true
    }
  };

  return {
    dir,

    image,
    css,
    javascript,
    html,
    fileinclude,
    fonts,

    browsersync
  }
};
