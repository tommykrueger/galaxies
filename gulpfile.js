var gulp = require('gulp');

var plugins = require('gulp-load-plugins')({

    pattern: ['gulp-*', 'gulp.*', 'run-sequence'], // the glob(s) to search for
    scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
    replaceString: /^gulp(-|\.)/, // what to remove from the name of the module when adding it to the context
    camelize: true, // if true, transforms hyphenated plugins names to camel case
    lazy: true, // whether the plugins should be lazy loaded on demand
    rename: { 'gulp-if': 'doif' } // a mapping of plugins to rename

});

var assetsConfig = require('./assets.json');

var src = './src/',
    dist = './public/';

var config = {

    production: false,
    iconfontName: 'icons',
    paths: {

        src: src,
        dist: dist,

        iconSrc: src + "icons/",
        svgSrc: src + "svg/",
        stylSrc: src + "stylus/",
        jsSrc: src + "js/",

        svgDest: "./svg/optimized/",
        cssDest: dist + '/css/',
        fontDest: "./fonts/",
        jsDest: "./js/"

    }

};


require('./gulp/js')(gulp, plugins, config, assetsConfig);
require('./gulp/stylus')(gulp, plugins, config);
require('./gulp/svg')(gulp, plugins, config);
require('./gulp/iconfont')(gulp, plugins, config);

gulp.task('watch-assets', function () {
    gulp.watch(config.paths.stylSrc + '**/*.styl', ['stylus']);
    gulp.watch(config.paths.jsSrc + '**/*.js', ['js']);
});

gulp.task('watch', ['default', 'watch-assets']);

gulp.task('default', ['js', 'stylus']);

// run "gulp production" to do production optimizations like compression, etc.
gulp.task('production', function(done) {

    config.production = true;
    plugins.runSequence('default', done)

});