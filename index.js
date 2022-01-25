import sass from 'sass';
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
 * @param {sass.LegacyValue}   value  Data to encode (stringify).
 * @param {sass.types.Boolean} quotes Should output string be quoted with single quotes.
 */
function encode(value, quotes) {
	const shouldQuote = quotes.getValue();
	let resolvedValue = JSON.stringify(getJsonValueFromSassValue(value));
	if (shouldQuote) {
		resolvedValue = `'${resolvedValue}'`;
	}
	return new sass.types.String(resolvedValue);
}

/**
 * Decodes (`JSON.parse`) string and returns one of available Sass types.
 *
 * @param {sass.types.String} value String to decode (parse).
 */
function decode(value) {
	/** @type {JsonValue?} */
	let resolvedValue = {};
	try {
		resolvedValue = JSON.parse(value.getValue());
	} catch (error) {
		resolvedValue = null;
	}
	return setJsonValueToSassValue(resolvedValue);
}

/** @type {{ 'json-encode($value, $quotes: true)': typeof encode, 'json-decode($value)': typeof decode }} */
const api = {
	'json-encode($value, $quotes: true)': encode,
	'json-decode($value)': decode
};

export default api;
