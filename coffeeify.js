var gulp       = require('gulp'),
    Elixir     = require('laravel-elixir'),
    path       = require('path'),
    source     = require('vinyl-source-stream'),
    browserify = require('browserify'),
    stringify  = require('stringify'),
    coffeeify  = require('coffeeify'),
    config     = Elixir.config;


Elixir.extend('coffeeify', function(src, output, options) {
	config.js.coffee = {'folder': 'coffee'};
	var paths = prepGulpPaths(src, output);

	new Elixir.Task('coffeeify', function() {
		that        = this;
		this.src    = paths.src.path;
		this.output = paths.output.path;

		this.recordStep('Compiling');

		var files = paths.src.path;
		if (files.constructor !== Array) {
			files = [files];
		}

		function make(file) {
			var outputFile = path.basename(file).replace('.coffee','.js');
			return browserify(file, {
				extensions: ['.coffee'],
				debug: config.production ? false : true
			})
			.transform(stringify, {
				appliesTo: { includeExtensions: ['.tpl'] },
				minify: config.production ? true : false,
				minifyOptions: {
					collapseWhitespace: true,
					conservativeCollapse: true
				}
			})
			.transform(coffeeify, {
				appliesTo: { includeExtensions: ['.coffee'] }
			})
			.bundle()
			.on('error', that.onError)
			.pipe(source(outputFile))
			.pipe(gulp.dest(paths.output.baseDir))
			.pipe(new Elixir.Notification('Coffeescript application compiled!'));
		}

		return files.map(make);
	})
	.watch(config.get('assets.js.coffee.folder') + '/**/*.coffee')
	.ignore(paths.output.path);
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|Array} src
 * @param  {string|null}  output
 * @return {Elixir.GulpPaths}
 */
var prepGulpPaths = function(src, output) {
	return new Elixir.GulpPaths()
		.src(src, config.get('assets.js.coffee.folder'))
		.output(output || config.get('public.js.outputFolder'), 'main.js');
};
