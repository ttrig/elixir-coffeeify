# Laravel Elixir Coffeeify (Beta)

An extension for laravel elixir to use browserify with coffee files and templates.

Forked from [Vinay Aggarwal](https://github.com/vinnizworld/elixir-coffeeify)

## Installation

```
npm install ttrig/elixir-coffeeify --save
```

## Usage

### `gulp`
Add the following to your `gulpfile.js`

```js
var elixir = require('laravel-elixir');

require('elixir-coffeeify');

elixir(function(mix) {
    mix.coffeeify('main.coffee');
});
```

and run the command `gulp`

This will look for the `main.coffee` file in the `resources/assets/coffee/` and it will run the file through browserify and generate `main.js` inside `public/js`.

### `gulp watch`
You can also use `gulp watch` command which will constantly watch for `.coffee` files in resources and re-execute coffeeify task.

## Testing

`npm test`

## License
[MIT](http://github.com/ttrig/elixir-coffeeify/blob/master/LICENSE)
