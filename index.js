import * as sass from 'sass';
import getJsonValueFromSassValue from './lib/sass-to-json.js';
import setJsonValueToSassValue from './lib/json-to-sass.js';

/**
 * @typedef {JsonPrimitive | JsonObject | JsonArray} JsonValue
 * @typedef {JsonValue[]} JsonArray
 * @typedef {string | number | boolean | null} JsonPrimitive
 * @typedef {{[Key in string]?: JsonValue}} JsonObject
 */

/**
 * Encodes (`JSON.stringify`) data and returns Sass string. By default, string is quoted with single quotes so that it can be easily used in standard CSS values.
 *
 * First argument:  `sass.Value` - Data to encode (stringify).
 *
 * Second argument: `sass.SassBoolean` - Should output string be quoted with single quotes.
 *
 * @param {sass.Value[]} encodeArguments
 */
function encode(encodeArguments) {
	const [data, quotes_] = encodeArguments;
	const quotes = quotes_.assertBoolean('quotes');
	const shouldQuote = quotes.value;
	let resolvedValue = JSON.stringify(getJsonValueFromSassValue(data));
	if (shouldQuote) {
		resolvedValue = `'${resolvedValue}'`;
	}
	return new sass.SassString(resolvedValue);
}

/**
 * Decodes (`JSON.parse`) string and returns one of available Sass types.
 *
 * First argument: `sass.SassString` - String to decode (parse).
 *
 * @param {sass.Value[]} decodeArguments
 */
function decode(decodeArguments) {
	const [string_] = decodeArguments;
	const string = string_.assertString('string');
	/** @type {JsonValue?} */
	let resolvedValue = {};
	try {
		resolvedValue = JSON.parse(string.text);
	} catch (error) {
		resolvedValue = null;
	}
	return setJsonValueToSassValue(resolvedValue);
}

/** @type {{ 'json-encode($data, $quotes: true)': typeof encode, 'json-decode($string)': typeof decode }} */
const api = {
	'json-encode($data, $quotes: true)': encode,
	'json-decode($string)': decode
};

export default api;
