module.exports = function(gulp, plugins, config, assetsConfig) {

    gulp.task('js', function () {

        var path = require('path');

        /* Bundles JS according to config in assets.json.
         * Entries there can be globs like "header/*.js"
         * Include assets from NPM packages by setting the
         * path to "vendor/npm/[module name]/[asset path]
         * e.g. "vendor/npm/bootstrap-styl/js/tooltip.js". */

        Object.keys(assetsConfig.js).forEach(function(bundle) {

            var pattern = /^vendor\/npm\/(.*?)\/(.*)/,
                files = assetsConfig.js[bundle];

            files.forEach(function(file, index){

                var match = file.match(pattern);

                if(match) {

                    var packageName =  match[1],
                        assetFile = match[2];

                    var packageDir = path.dirname(require.resolve(packageName));
                    packageDir = path.relative(config.paths.jsSrc, packageDir);

                    if(packageDir) files[index] = packageDir + '/' + assetFile;

                }

            });

            gulp.src( files, { cwd: config.paths.jsSrc } )
                .pipe(plugins.doif(!config.production, plugins.newer( config.paths.jsDest + bundle + '.js' )))
                .pipe(plugins.debug({ title: 'concatenating js to bundle '+bundle+'.js:' }))
                .pipe(plugins.doif(!config.production, plugins.sourcemaps.init()))
                .pipe(plugins.concat(bundle + '.js'))
                .pipe(plugins.doif(config.production, plugins.uglify()))
                .pipe(plugins.doif(!config.production, plugins.sourcemaps.write('.')))
                .pipe(gulp.dest( config.paths.jsDest ));

        });

    });

};