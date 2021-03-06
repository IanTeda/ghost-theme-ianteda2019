/**
 * PACKAGE REQUIRES
 * Setup up NPM packages
 */
// Take a big drink
import gulp from "gulp";
import browserSync from "browser-sync";

// Change working directory to Ghost server to run Nodemon
process.chdir("../../../");

/**
 * GULP LOAD PLUGINS
 * Lazy load plugins, save on var declaration
 */
var $ = require("gulp-load-plugins")({
  //  https://github.com/jackfranklin/gulp-load-plugins

  // When set to true, the plugin will log info to console
  DEBUG: false,

  // the glob(s) to search for in package.json
  pattern: ["gulp-*", "gulp.*", "del", "merge2", "shelljs"],

  // if true, transforms hyphenated plugins names to camel case
  camelize: true,

  // whether the plugins should be lazy loaded on demand
  lazy: true
});

/**
 * PATH CONSTANTS
 * Some constants for file paths
 */
let THEME_NAME = "ghost-theme-ianteda2019";
let THEME_PATH = "content/themes/" + THEME_NAME + "/";
const paths = {
  theme: {
    src: THEME_PATH + "**/*.{hbs,js,css,png,jpg,gif}"
  },
  images: {
    src: THEME_PATH + "src/images/**/*.{png,gif,jpg}",
    dest: THEME_PATH + "assets/images/"
  },
  sass: {
    filename: "materialize-custom.css",
    src: THEME_PATH + "src/sass/materialize.scss",
    dest: THEME_PATH + "src/styles/"
  },
  scripts: {
    filename: THEME_NAME + ".min.js",
    src: [
      // NOTE: Order is important
      THEME_PATH + "src/scripts/jquery-3.3.1.js",
      THEME_PATH + "src/scripts/jquery.fitvids-1.1.js",
      THEME_PATH + "src/scripts/wow-1.1.3.js",
      THEME_PATH + "src/scripts/materialize.js",
      THEME_PATH + "src/scripts/main.js"
    ],
    dest: THEME_PATH + "assets/scripts/"
  },
  styles: {
    filename: THEME_NAME + ".min.css",
    src: THEME_PATH + "src/styles/main.css",
    dest: THEME_PATH + "assets/styles/"
  }
};

/**
 * SWALLOW ERROR
 * Swallow error so we don't need to restart gulp tasks
 */
var swallowError = function swallowError(error) {
  $.util.log(error.toString());
  $.util.beep();
  this.emit("end");
};

/**
 * CLEAN ASSETS
 * Delete contents in assets folder
 */
// Del is executed in node (shell)
export const clean = () => $.del(["assets"]);

/**
 * BROWSER SYNC
 * Sync and reload browser on changes
 * @param {*} callback
 */
export function startBrowserSync(callback) {
  return browserSync.init(
    {
      // Local ghost dev address
      proxy: "localhost:2368",
      port: 5000,
      browser: "google chrome",
      notify: true
    },
    callback()
  );
}

/**
 * NODEMON
 * Use Nodemon to restart Ghost when template extensions change
 * @param {*} callback
 */
export function startNodemon(callback) {
  // Ghost server
  var ghostServer = $.nodemon({
    verbose: false,
    script: "current/index.js",
    watch: ["some random text"],
    ignore: [".git", "node_modules"],
    ext: "hbs,js,css",
    done: callback()
  });

  // This doesn't trigger BrowserSync Reload?
  ghostServer.on("start", () => {
    browserSync.reload();
  });
}

/**
 * IMAGES TASK
 * Resize and optimise images
 */
export function images() {
  let imageminOptions = {
    // https://github.com/sindresorhus/gulp-imagemin

    interlaced: true,
    optimizationLevel: 7,
    progressive: true,
    svgoPlugins: [{ removeViewBox: true }]
  };

  return (
    gulp
      .src(paths.images.src)
      // Swallow task  error
      .on("error", swallowError)

      // Minimise images
      .pipe($.imagemin(imageminOptions))

      // Save images to destination
      .pipe(gulp.dest(paths.images.dest))

      // Ping Browser Sync stream
      .pipe(browserSync.stream())
  );
}

/**
 * SASS
 * Compile sass files
 */
export function sass() {
  return (
    gulp
      .src(paths.sass.src)
      // Compile to css
      .pipe($.sass().on("error", $.sass.logError))

      // Rename dest pipe output
      .pipe($.rename(paths.sass.filename))

      // Write stream to destination folder
      .pipe(gulp.dest(paths.sass.dest))
  );
}

/**
 * SCRIPTS TASK
 * Javascript task
 */
export function scripts() {
  return (
    gulp
      .src(paths.scripts.src)
      // Swallow task  error
      .on("error", swallowError)

      // Use source maps for debugging
      .pipe($.sourcemaps.init())

      // Concatenate source files.
      .pipe($.concat(paths.scripts.filename))
      .pipe($.size({ title: "Scripts concatenated into one file:" }))

      // Remove white space
      .pipe($.uglify().on("error", swallowError))

      // Write source maps to destination folder for easier debugging
      .pipe($.sourcemaps.write("."))

      // Write stream to destination folder
      .pipe(gulp.dest(paths.scripts.dest))

      // Ping Browser Sync
      .pipe(browserSync.stream())
  );
}

/**
 * STYLES TASK
 * CSS, PostCSS
 */
export function styles() {
  // What plugins should we use with PostCSS
  let postcssPlugins = [
    // NOTE: Order is important
    require("postcss-import"),
    require("autoprefixer")({ browsers: ["last 3 version"] }),
    require("postcss-mixins"),
    require("postcss-nested"),
    require("postcss-color-function"),
    require("cssnano")
  ];

  return (
    gulp
      .src(paths.styles.src)
      // Swallow task  error
      .on("error", swallowError)

      // Initiate sourcemaps for easy debug
      .pipe($.sourcemaps.init())

      // Concatenate css, since order is important
      .pipe($.concat(paths.styles.filename))
      .pipe($.size({ title: "Style concatenated into one file:" }))

      // Apply PostCSS processors to the stream
      .pipe($.postcss(postcssPlugins))
      .pipe($.size({ title: "postCSS:" }))

      // Write source maps to destination folder for easier debugging
      .pipe($.sourcemaps.write("."))
      .pipe($.size({ title: "Source maps written:" }))

      // Write stream to destination
      .pipe(gulp.dest(paths.styles.dest))

      // Ping Browser Sync
      .pipe(browserSync.stream())
  );
}

/**
 * WATCH
 * Watch source files for changes and execute task on change
 */
export function watch() {
  // Watch for changes, then trigger tasks on change
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.sass.src, sass);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.theme.src).on("change", browserSync.reload);
}

/**
 * BUILD ASSETS
 * Build out assets with Gulp
 */
const build = gulp.series(clean, sass, gulp.parallel(styles, scripts, images));
gulp.task("build", build);

/**
 * GHOST SERVER
 * Start Nodemon and Browser Sync
 */
const startGhostServer = gulp.series(startBrowserSync, startNodemon);

/**
 * DEFAULT
 * Export default Gulp task
 */
const develop = gulp.series(build, startGhostServer, watch);
gulp.task("default", develop);
