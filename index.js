'use strict';

const sass = require('node-sass');
const getJsonValueFromSassValue = require('./lib/sass-to-json');
const setJsonValueToSassValue = require('./lib/json-to-sass');
const types = sass.types;

/**
 * @param  {sass.types.*} value
 * @param  {Boolean|sass.types.Boolean} quotes
 *
 * @return {sass.types.String}
 */
function encode ( value, quotes ) {
	const shouldQuote = quotes.getValue();
	let resolvedValue = JSON.stringify(getJsonValueFromSassValue(value, { precision: this.options.precision }));
	if ( shouldQuote ) {
		resolvedValue = `'${resolvedValue}'`;
	}
	return new types.String(resolvedValue);
}

/**
 * @param  {sass.types.String|sass.types.Number|sass.types.Boolean|sass.types.Null} value
 *
 * @return {sass.types.*}
 */
function decode ( value ) {
	let resolvedValue = {};
	try {
		resolvedValue = JSON.parse(value.getValue());
	} catch ( e ) {
		resolvedValue = null;
	}
	return setJsonValueToSassValue(resolvedValue);
}

module.exports.encode = encode;
module.exports.decode = decode;

module.exports = {
	'json-encode($value, $quotes: true)': encode,
	'json-decode($value)': decode
};
