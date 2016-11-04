var fs     = require('fs');
var chai   = require('chai');
var remove = require('rimraf');
var assert = chai.assert;

require('../coffeeify.js');

Elixir.config.notifications = false;

global.shouldExist = function(file, contents) {
	assert.isTrue(fs.existsSync(file));
	if (contents) {
		assert.include(fs.readFileSync(file, { encoding: 'utf8' }), contents);
	}
};

global.runGulp = function(assertions) {
	gulp.start('default', function() {
		setTimeout(function() {
			assertions();
			remove.sync('./public');
		}, 100);
	});
};

describe('Coffeeify Task', function() {
	beforeEach(function() { Elixir.tasks.empty(); });

	it('compiles to default output path', function(done) {
		Elixir(function(mix) {
			mix.coffeeify('main.coffee');
		});
		runGulp(function() {
			shouldExist('public/js/main.js', 'Hello');
			done();
		});
	});

	it('compiles to custom output path', function(done) {
		Elixir(function(mix) {
			mix.coffeeify('main.coffee', 'public/js/app');
		});
		runGulp(function() {
			shouldExist('public/js/app/main.js', 'Hello');
			done();
		});
	});

	it('compiles multiple applications', function(done) {
		Elixir(function(mix) {
			mix.coffeeify(['foo.coffee', 'bar.coffee']);
		});
		runGulp(function() {
			shouldExist('public/js/foo.js', 'Foo');
			shouldExist('public/js/bar.js', 'Bar');
			done();
		});
	});

});
