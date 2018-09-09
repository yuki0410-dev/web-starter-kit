const gulp         = require('gulp');
const $            = require('gulp-load-plugins')();
const isProd       = (process.env.NODE_ENV === 'production');
const yargs        = Object.assign({}, {
  src  : 'src',
  dest : (isProd) ? 'dest' : '.cache',
}, require('yargs').argv);
const src          = {
  'build' : {},
  'watch' : {},
  'copy'  : {},
};
const errorHandler = function(error) {
  const notifier = require('node-notifier');
  const title    = `${error.name} in plugin "${error.plugin}"`;
  const message  = error.message;
  console.log(title);
  console.log(message);
  notifier.notify({
    'title'   : title,
    'message' : message,
  });
};

/* =========================================================
 *  Server Tasks
 * ========================================================= */
const browserSync = require('browser-sync').create();
/**
 * Server Up Task
 */
gulp.task('server', (done) => {
  browserSync.init(
    Object.assign({}, require('./.bs-config'), {
      'server': {
        'baseDir': [
          yargs.dest,
          yargs.src,
        ],
      },
    }),
    done
  );
});
/**
 * Server Reload Task
 */
gulp.task('server::reload', (done) => {
  browserSync.reload();
  done();
});

/* =========================================================
 *  Clean Tasks
 * ========================================================= */
/**
 * Dest Clean Task
 */
gulp.task('clean', () =>
  require('del')(
    `${yargs.dest}/**/*`
  )
);

/* =========================================================
 *  HTML Tasks
 * ========================================================= */
src.build.html = {};
src.watch.html = {};
/* ---------------------------------------------------------
 *  Handlebars Tasks
 * --------------------------------------------------------- */
const handlebarsConfig  = Object.assign({}, {
  data       : 'src/markup/data/**/*.js',
  decorators : 'src/markup/decorators/**/*.{json,js}',
  helpers    : 'src/markup/helpers/**/*.js',
  layouts    : 'src/markup/layouts/**/*.{hbs,handlebars,js}',
  partials   : 'src/markup/partials/**/*.{hbs,handlebars,js}',
}, require('./.handlebars.config'));
/**
 * Build Handlebars Task
 */
const handlebars          = require('handlebars');
const handlebarsLayouts   = require('handlebars-layouts');
const handlebarsHelpers   = require('handlebars-helpers')();
const frontMatter         = require('front-matter');
src.build.html.handlebars = [
  `${yargs.src}/**/*.hbs`,
  `${yargs.src}/**/*.handlebars`,
  `!${handlebarsConfig.helpers}`,
  `!${handlebarsConfig.data}`,
  `!${handlebarsConfig.decorators}`,
  `!${handlebarsConfig.layouts}`,
  `!${handlebarsConfig.partials}`,
];
gulp.task('build::html::handlebars', () =>
  gulp.src(src.build.html.handlebars)
    .pipe($.plumber({
      'errorHandler': errorHandler,
    }))
    .pipe($.data((file) => {
      const content = frontMatter(String(file.contents));
      file.contents = new Buffer(content.body);
      return content.attributes;
    }))
    .pipe($.hb({
        'handlebars': handlebars,
      })
      .helpers(handlebarsLayouts)
      .helpers(handlebarsHelpers)
      .helpers(handlebarsConfig.helpers)
      .data(handlebarsConfig.data)
      .decorators(handlebarsConfig.decorators)
      .partials(handlebarsConfig.layouts)
      .partials(handlebarsConfig.partials)
    )
    .pipe($.rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(yargs.dest))
);
/**
 * Watch Handlebars Task
 */
src.watch.html.handlebars = [
  `${yargs.src}/**/*.hbs`,
  `${yargs.src}/**/*.handlebars`,
  `${handlebarsConfig.helpers}`,
  `${handlebarsConfig.data}`,
  `${handlebarsConfig.decorators}`,
  `${handlebarsConfig.layouts}`,
  `${handlebarsConfig.partials}`,
];
gulp.task('watch::html::handlebars', () =>
  gulp.watch(src.watch.html.handlebars, gulp.series(
    'build::html::handlebars',
    'server::reload'
  ))
);

/* =========================================================
 *  Style Tasks
 * ========================================================= */
src.build.style = {};
src.watch.style = {};
/* ---------------------------------------------------------
 *  Sass Tasks
 * --------------------------------------------------------- */
 /**
 * Build Sass Task
 */
src.build.style.sass = [
  `${yargs.src}/**/*.sass`,
  `${yargs.src}/**/*.scss`,
];
gulp.task('build::style::sass', () =>
  gulp.src(src.build.style.sass)
    .pipe($.plumber({
      'errorHandler': errorHandler,
    }))
    .pipe($.if(!isProd, $.sourcemaps.init()))
    .pipe($.sass(require('./.sassrc')))
    .pipe($.postcss())
    .pipe($.if(!isProd, $.sourcemaps.write('./')))
    .pipe(gulp.dest(yargs.dest))
    .pipe(browserSync.stream())
);
/**
 * Watch Sass Task
 */
src.watch.style.sass = src.build.style.sass;
gulp.task('watch::style::sass', () =>
  gulp.watch(src.watch.style.sass, gulp.series(
    'build::style::sass'
  ))
);

/* =========================================================
 *  JavaScript Tasks
 * ========================================================= */
src.build.script = {};
src.watch.script = {};
/* ---------------------------------------------------------
 *  Webpack Tasks
 * --------------------------------------------------------- */
const webpackConfig = Object.assign({}, require('./.webpack.config'));
/**
 * Build Webpack Tasks
 */
const named              = require('vinyl-named');
const webpack            = require('webpack');
const webpackStream      = require('webpack-stream');
src.build.script.webpack = [
  `${yargs.src}/**/*.js`,
  `!${yargs.src}/**/modules/**/*.js`,
];
gulp.task('build::script::webpack', () =>
  gulp.src(src.build.script.webpack)
    .pipe(named(function(file) {
      return file.relative.replace(/\.[^\.]+$/, '');
    }))
    .pipe(webpackStream(
      webpackConfig,
      webpack,
    )).on('error', function(e) {
      this.emit('end');
    })
    .pipe(gulp.dest(yargs.dest))
);
/**
 * Watch Webpack Task
 */
src.watch.script.webpack = [
  `${yargs.src}/**/*.js`,
];
gulp.task('watch::script::webpack', () =>
  gulp.watch(src.watch.script.webpack, gulp.series(
    'build::script::webpack',
    'server::reload'
  ))
);

/* =========================================================
 *  Resource Tasks
 * ========================================================= */
/**
 * Copy Resource Task
 */
src.copy.resource = [
  `${yargs.src}/**/*.*`,
];
Object.keys(src.watch).forEach(function(asset) {
  Object.keys(src.watch[asset]).forEach(function(type) {
    src.watch[asset][type].forEach(function(rule) {
      src.copy.resource.push(`!${rule}`);
    });
  });
});
gulp.task('copy::resource', () =>
  gulp.src(src.copy.resource)
    .pipe(gulp.dest(yargs.dest))
);
/**
 * Watch Resource Task
 */
src.watch.resource = src.copy.resource;
gulp.task('watch::resource', () =>
  gulp.watch(src.watch.resource, gulp.series(
    'server::reload'
  ))
);

/* =========================================================
 *  Bundle Tasks
 * ========================================================= */
/**
 * Build Task
 */
 gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'build::html::handlebars',
    'build::style::sass',
    'build::script::webpack',
    'copy::resource'
  )
));
/**
 * Watch Task
 */
gulp.task('watch', gulp.series(
  'clean',
  gulp.parallel(
    'build::html::handlebars',
    'build::style::sass',
    'build::script::webpack'
  ),
  gulp.parallel(
    'watch::html::handlebars',
    'watch::style::sass',
    'watch::script::webpack',
    'watch::resource'
  )
));
/**
 * Default Task
 */
gulp.task('default', gulp.series(
  'server',
  'watch'
));
