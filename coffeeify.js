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
		this.src    = paths.src.path;
		this.output = paths.output.path;
		return gulpTask.call(this, paths, options);
	})
	.watch(paths.src.baseDir + '/**/*.coffee')
	.ignore(paths.output.path);
});


var gulpTask = function(paths, options) {
	this.recordStep('Compiling CoffeeScript');
	var outputFile = path.basename(paths.src.path).replace('.coffee', '.js');
	var that = this;
	return browserify(paths.src.path, {
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
	.on('error', function(er) {
		new Elixir.Notification('CoffeeScript Compilation Failed!');
		Elixir.log.divider().error(er).divider();
		that.recordStep('Error!');
		this.emit('end');
	})
	.pipe(source(outputFile))
	.pipe(gulp.dest(paths.output.baseDir))
	.pipe(new Elixir.Notification('Coffeescript application compiled!'));
};


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
		.output(output || config.get('public.js.outputFolder'), 'bundle.js');
};
