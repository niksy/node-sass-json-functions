# node-sass-json-functions

[![Build Status][ci-img]][ci]

JSON encode and decode functions for [node-sass][node-sass].

## Install

```sh
npm install node-sass-json-functions --save
```

## Usage

```js
var sass = require('node-sass');
var jsonFns = require('node-sass-json-functions');

sass.render({
	file: './index.scss',
	functions: Object.assign({}, jsonFns)
}, function ( err, res ) {
	// ...
});
```

Module exports object with prepared functions `json-encode` and `json-decode`. If you need functions as separate entities, they are available as static properties `encode` and `decode`.

### Encode

Input:

```scss
$list: 1, 2, "3", (4,5,6), (foo: "bar baz");
$map: (
	foo: 1,
	bar: (2, 3),
	baz: "3 3 3",
	bad: (
		foo: 11,
		bar: 22,
		baz: (
			5, 4, 6, null, 1
		),
		bag: "foo bar"
	),
	qux: rgba(255,255,255,0.5),
	corgle: red
);

body {
	content: json-encode($list);
	content: json-encode($map);
	content: json-encode($list, $quotes: false);
	content: json-encode($map, $quotes: false);
}
```

Output:

```css
body {
	content: '[1,2,"3",[4,5,6],{"foo":"bar baz"}]';
	content: '{"foo":1,"bar":[2,3],"baz":"3 3 3","bad":{"foo":11,"bar":22,"baz":[5,4,6,null,1],"bag":"foo bar"},"qux":"rgba(255,255,255,0.5)","corgle":"#f00"}';
	content: [1,2,"3",[4,5,6],{"foo":"bar baz"}];
	content: {"foo":1,"bar":[2,3],"baz":"3 3 3","bad":{"foo":11,"bar":22,"baz":[5,4,6,null,1],"bag":"foo bar"},"qux":"rgba(255,255,255,0.5)","corgle":"#f00"};
}
```

### Decode

Input:

```scss
$array: '[1,2,"3",[4,5,6],{"foo":"bar baz"}]';
$object: '{"foo":1,"bar":[2,3],"baz":"3 3 3","bad":{"foo":11,"bar":22,"baz":[5,4,6,null,1],"bag":"foo bar"},"qux":"rgba(255,255,255,0.5)","corgle":"#f00"}';

@debug json-decode($array);
@debug json-decode($object);
```

Output:

```sh
DEBUG: 1, 2, 3, 4, 5, 6, (foo: bar baz)
DEBUG: (foo: 1, bar: 2, 3, baz: 3 3 3, bad: (foo: 11, bar: 22, baz: 5, 4, 6, null, 1, bag: foo bar), qux: rgba(255, 255, 255, 0.5), corgle: red)
```

## API

### json-encode(data, [quotes])

Returns: `sass.types.String`

Encodes (`JSON.stringify`) data and returns [Sass string][sass-string]. By default, string is quoted with single quotes so that it can be easily used in standard CSS values.

* [Sass lists][sass-list] are transformed to arrays
* [Sass maps][sass-map] are transformed to objects
* [Sass colors][sass-color] are transformed to `rgba()` syntax if they have alpha value, otherwise they are transformed to hex value (and it’s shorther version if possible)
* [Sass strings][sass-string] are transformed to strings
* Sass numbers are transformed to numbers
* Sass null values and anything unresolved is transformed to null values

#### data

Type: `sass.types.*`  
**Required**

Data to encode (stringify).

#### quotes

Type: `Boolean|sass.types.Boolean`  
Default: `true`

Should output string be quoted with single quotes.

### json-decode(data)

Returns: `sass.types.*`

Decodes (`JSON.parse`) string and returns one of [available Sass types][sass-types].

* Arrays are transformed to [Sass lists][sass-list]
* Objects are transformed to [Sass maps][sass-map]
* Anything properly parsed with [parse-color][parse-color] is transformed to [Sass color][sass-color]
* Strings are transformed to [Sass strings][sass-string]
* Numbers are transformed to Sass numbers
* Null values and anything unresolved is transformed to Sass null values

#### data

Type: `sass.types.String|sass.types.Number|sass.types.Boolean|sass.types.Null`

String to decode (parse).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/node-sass-json-functions
[ci-img]: https://img.shields.io/travis/niksy/node-sass-json-functions.svg
[node-sass]: https://github.com/sass/node-sass
[sass-types]: https://github.com/sass/node-sass#functions--v300---experimental
[sass-list]: http://sass-lang.com/documentation/file.SASS_REFERENCE.html#lists
[sass-map]: http://sass-lang.com/documentation/file.SASS_REFERENCE.html#maps
[sass-color]: http://sass-lang.com/documentation/file.SASS_REFERENCE.html#colors
[sass-string]: http://sass-lang.com/documentation/file.SASS_REFERENCE.html#sass-script-strings
[parse-color]: https://github.com/substack/parse-color
