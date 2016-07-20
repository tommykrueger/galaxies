module.exports = function(gulp, plugins, config) {

    var fs = require('fs');

    gulp.task('iconfont', function () {

        gulp.src(config.paths.iconSrc+'*.svg')
            .pipe(plugins.doif(!config.production, plugins.newer(config.paths.fontDest + config.iconfontName + '.ttf')))
            .pipe(plugins.debug({ title: 'compiling iconfont:' }))
            .pipe(plugins.rename(function (path) {
                path.basename = path.basename.replace(/icons_v(\d+)_/,'').replace('_','-').replace(/-\s+/g,'-').replace(/\s/g,'-').toLowerCase();
            }))
            .pipe(plugins.doif(config.production, plugins.svgmin({
                plugins: [
                    {
                        removeUselessStrokeAndFill: true
                    }
                ]
            })))
            .pipe(plugins.iconfont({
                fontName: config.iconfontName, // required
                appendUnicode: false,
                startUnicode: 0xEB01
            }))
            .on('glyphs', function(glyphs, options) {

                console.log(glyphs, options);

                var icons = {};

                glyphs.forEach(function(v,i) { icons[v.name] = '\\' + v.unicode[0].charCodeAt(0).toString(16).toUpperCase() });

                var stringJSON = JSON.stringify( icons, null, 4);
                fs.writeFileSync(config.paths.stylSrc + 'icons.json', stringJSON);

            })
            .pipe(gulp.dest(config.paths.fontDest));

    });

};