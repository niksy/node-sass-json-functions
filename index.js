'use strict';

var sass = require('node-sass');
var getJsonValueFromSassValue = require('./lib/sass-to-json').getJsonValueFromSassValue;
var setJsonValueToSassValue = require('./lib/json-to-sass').setJsonValueToSassValue;
var types = sass.types;

/**
 * @param  {sass.types.*} value
 * @param  {Boolean|sass.types.Boolean} quotes
 *
 * @return {sass.types.String}
 */
function encode ( value, quotes ) {
	var shouldQuote = quotes.getValue();
	var resolvedValue = JSON.stringify(getJsonValueFromSassValue(value, { precision: this.options.precision }));
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
	var resolvedValue = {};
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
