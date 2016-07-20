module.exports = function(gulp, plugins, config) {

    gulp.task('svg', function () {

        if(!config.production) return true;

        gulp.src(config.paths.svgSrc+'*.svg')
            .pipe(plugins.debug({ title: 'optimizing svg:' }))
            .pipe(plugins.svgmin({
                plugins: [
                    {
                        removeUselessStrokeAndFill: true
                    }
                ]
            }))
            .pipe(gulp.dest(config.paths.svgDest));

    });

};