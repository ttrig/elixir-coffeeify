var gulp       = require('gulp');
var Elixir     = require('laravel-elixir');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var path       = require('path');
var coffeeify  = require('coffeeify');
var config     = Elixir.config;

Elixir.extend('coffeeify', function(src, output, options) {
	var paths = prepGulpPaths(src, output);

	new Elixir.Task('coffeeify', function() {
		this.log(paths.src, paths.output);

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
			.transform(coffeeify)
			.bundle()
			.on('error', function(e) {
				new Elixir.Notification().error(e, 'CoffeeScript Compilation Failed!');
				this.emit('end');
			})
			.pipe(source(outputFile))
			.pipe(gulp.dest(paths.output.baseDir))
			.pipe(new Elixir.Notification('CoffeeScript Compiled [coffeeify]!'));
		}

		return files.map(make);
	})
	.watch(config.get('assets.js.coffee.folder') + '/**/*.coffee')
	.ignore(paths.output.path);
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|array} src
 * @param  {string|null}  output
 * @return {object}
 */
var prepGulpPaths = function(src, output) {
	return new Elixir.GulpPaths()
		.src(src, config.get('assets.js.coffee.folder'))
		.output(output || config.get('public.js.outputFolder'), 'all.js');
};
