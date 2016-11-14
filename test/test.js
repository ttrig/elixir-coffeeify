var fs     = require('fs'),
    chai   = require('chai'),
    remove = require('rimraf'),
    assert = chai.assert;

require('../coffeeify.js');

Elixir.config.notifications = false;


global.shouldExist = function(file, contents) {
	assert.isTrue(fs.existsSync(file));
	if (contents) {
		assert.include(fs.readFileSync(file, { encoding: 'utf8' }), contents);
	}
};

global.shouldNotExist = function(file) {
	assert.isFalse(fs.existsSync(file));
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


	it('should not compile on error', function(done) {
		Elixir(function(mix) {
			mix.coffeeify('bork.coffee');
		});
		runGulp(function() {
			shouldNotExist('public/js/bork.js');
			done();
		});
	});


});
