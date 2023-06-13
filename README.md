# node-sass-json-functions

[![Build Status][ci-img]][ci]

JSON encode and decode functions for [sass][sass].

## Install

```sh
npm install sass node-sass-json-functions --save
```

## Usage

```js
import * as sass from 'sass';
import jsonFns from 'node-sass-json-functions';

(async () => {
	const result = await sass.compileAsync('./index.scss', {
		functions: { ...jsonFns }
	});
	// ...
})();
```

Module exports object with prepared functions `json-encode` and `json-decode`.

### Encode

Input:

```scss
$list: 1, 2, '3', (4, 5, 6), (
		foo: 'bar baz'
	);
$map: (
	foo: 1,
	bar: (
		2,
		3
	),
	baz: '3 3 3',
	bad: (
		foo: 11,
		bar: 22,
		baz: (
			5,
			4,
			6,
			null,
			1,
			1.23456789px
		),
		bag: 'foo bar'
	),
	qux: rgba(255, 255, 255, 0.5),
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
	content: '{"foo":1,"bar":[2,3],"baz":"3 3 3","bad":{"foo":11,"bar":22,"baz":[5,4,6,null,1,"1.23457px"],"bag":"foo bar"},"qux":"rgba(255,255,255,0.5)","corgle":"#f00"}';
	content: [1,2,"3",[4,5,6],{"foo":"bar baz"}];
	content: {"foo":1,"bar":[2,3],"baz":"3 3 3","bad":{"foo":11,"bar":22,"baz":[5,4,6,null,1,"1.23457px"],"bag":"foo bar"},"qux":"rgba(255,255,255,0.5)","corgle":"#f00"};
}
```

### Decode

Input:

```scss
$array: '[1,2,"3",[4,5,6],{"foo":"bar baz"}]';
$object: '{"foo":1,"bar":[2,3],"baz":"3 3 3","bad":{"foo":11,"bar":22,"baz":[5,4,6,null,1,"1.23456789px"],"bag":"foo bar"},"qux":"rgba(255,255,255,0.5)","corgle":"#f00"}';

@debug json-decode($array);
@debug json-decode($object);
```

Output:

```sh
DEBUG: 1, 2, 3, 4, 5, 6, (foo: bar baz)
DEBUG: (foo: 1, bar: 2, 3, baz: 3 3 3, bad: (foo: 11, bar: 22, baz: 5, 4, 6, null, 1, 1.23456789px, bag: foo bar), qux: rgba(255, 255, 255, 0.5), corgle: red)
```

## API

### json-encode(data[, quotes])

Returns: `sass.SassString`

Encodes (`JSON.stringify`) data and returns [Sass string][sass-string]. By
default, string is quoted with single quotes so that it can be easily used in
standard CSS values.

-   [Sass lists][sass-list] are transformed to arrays
-   [Sass maps][sass-map] are transformed to objects
-   [Sass colors][sass-color] are transformed to `rgba()` syntax if they have
    alpha value, otherwise they are transformed to hex value (and it’s shorther
    version if possible)
-   [Sass strings][sass-string] are transformed to strings
-   [Sass numbers][sass-number] are transformed to numbers
-   [Sass booleans][sass-boolean] are transformed to booleans
-   [Sass null][sass-null] values and anything unresolved is transformed to null
    values

#### data

Type: `sass.Value`

Data to encode (stringify).

#### quotes

Type: `sass.SassBoolean`  
Default: `sass.sassTrue`

Should output string be quoted with single quotes.

### json-decode(string)

Returns: `sass.Value`

Decodes (`JSON.parse`) string and returns one of [available Sass
types][sass-types].

-   Arrays are transformed to [Sass lists][sass-list]
-   Objects are transformed to [Sass maps][sass-map]
-   Anything properly parsed with [parse-color][parse-color] is transformed to
    [Sass color][sass-color]
-   Strings are transformed to Sass numbers with units if they can be properly
    parsed with [parse-css-dimension][parse-css-dimension], otherwise they are
    transformed to [Sass strings][sass-string]
-   Numbers are transformed to [Sass numbers][sass-number]
-   Booleans are transformed to [Sass booleans][sass-boolean]
-   Null values and anything unresolved is transformed to [Sass null][sass-null]
    values

#### string

Type: `sass.SassString`

String to decode (parse).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://github.com/niksy/node-sass-json-functions/actions?query=workflow%3ACI
[ci-img]: https://github.com/niksy/node-sass-json-functions/workflows/CI/badge.svg?branch=master
[sass]: https://github.com/sass/dart-sass
[sass-types]: https://sass-lang.com/documentation/js-api/classes/Value
[sass-list]: https://sass-lang.com/documentation/values/lists
[sass-map]: https://sass-lang.com/documentation/values/maps
[sass-color]: https://sass-lang.com/documentation/values/colors
[sass-number]: https://sass-lang.com/documentation/values/numbers
[sass-string]: https://sass-lang.com/documentation/values/strings
[sass-null]: https://sass-lang.com/documentation/values/null
[sass-boolean]: https://sass-lang.com/documentation/values/booleans
[parse-color]: https://github.com/substack/parse-color
[parse-css-dimension]: https://github.com/jedmao/parse-css-dimension

<!-- prettier-ignore-end -->
