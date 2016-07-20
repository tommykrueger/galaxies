module.exports = function(gulp, plugins, config, assetsConfig) {

    gulp.task('helpers', function () {

        Object.keys(assetsConfig.helpers).forEach(function(src) {

            var destDir = config.paths.dist + assetsConfig.helpers[src];

            gulp.src(src, { cwd: config.paths.src })
                .pipe(plugins.newer(destDir))
                .pipe(plugins.debug({ title: 'copying helpers:' }))
                .pipe(gulp.dest(destDir))

        });

    });

};