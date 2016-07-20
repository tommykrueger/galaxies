module.exports = function(gulp, plugins, config) {

    var inlineSVG = require('stylus-inline-svg');
    var bootstrapStylus = require('bootstrap-styl');
    var nib = require('nib');

    gulp.task('stylus', ['svg', 'iconfont'], function () {

        var stylusOptions = {

            "disable cache": false,
            "compress": false,
            "include css": true,
            paths: [config.paths.stylSrc],
            use: [bootstrapStylus(), nib()],
            import: ['nib']

        };

        if(config.production) {

            stylusOptions.define = { 'inline-svg-url': inlineSVG({'paths': [__dirname + '/' + config.paths.svgDest]}) };

        } else {

            stylusOptions.url = { name: 'inline-svg-url', limit: false, 'paths': [__dirname + '/' + config.paths.svgSrc] };

        }


        gulp.src(config.paths.stylSrc+'!(_)*.styl')
            //.pipe(plugins.doif(!config.production, plugins.newer(config.paths.cssDest)))
            //.pipe(plugins.progeny())
            .pipe(plugins.debug({ title: 'compiling stylus:' }))
            .pipe(plugins.doif(!config.production, plugins.sourcemaps.init()))
            .pipe(plugins.stylus(stylusOptions))
            .pipe(plugins.autoprefixer())
            .pipe(plugins.doif(config.production, plugins.minifyCss({
                keepSpecialComments: 0,
                advanced: true,
                aggressiveMerging: true,
                mediaMerging: true,
                restructuring: true,
                shorthandCompacting: true,
                compatibility: 'ie8',
                processImport: false,
                semanticMerging: false,
                keepBreaks: false,
                roundingPrecision: 3,
                rebase: true
            })))
            .pipe(plugins.doif(!config.production, plugins.sourcemaps.write('.')))
            .pipe(gulp.dest(config.paths.cssDest))
    });

};