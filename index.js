import createGetJsonValueFromSassValue from './lib/sass-to-json.js';
import createSetJsonValueToSassValue from './lib/json-to-sass.js';

/**
 * @typedef {JsonPrimitive | JsonObject | JsonArray} JsonValue
 * @typedef {JsonValue[]} JsonArray
 * @typedef {string | number | boolean | null} JsonPrimitive
 * @typedef {{[Key in string]?: JsonValue}} JsonObject
 */

/**
 * @param {typeof import('sass')} sass
 */
export default function createJsonFunctions(sass) {
	const getJsonValueFromSassValue = createGetJsonValueFromSassValue(sass);
	const setJsonValueToSassValue = createSetJsonValueToSassValue(sass);

	/**
	 * Encodes (`JSON.stringify`) data and returns Sass string. By default, string is quoted with single quotes so that it can be easily used in standard CSS values.
	 *
	 * First argument:  `sass.Value` - Data to encode (stringify).
	 *
	 * Second argument: `sass.SassBoolean` - Should output string be quoted with single quotes.
	 *
	 * @param {import('sass').Value[]} encodeArguments
	 */
	function encode(encodeArguments) {
		const [data, quotes_] = encodeArguments;
		const quotes = quotes_?.assertBoolean('quotes');
		const shouldQuote = Boolean(quotes?.value);
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
	 * @param {import('sass').Value[]} decodeArguments
	 */
	function decode(decodeArguments) {
		const [string_] = decodeArguments;
		const string = string_?.assertString('string');
		/** @type {JsonValue?} */
		let resolvedValue = {};
		try {
			resolvedValue = string ? JSON.parse(string.text) : null;
		} catch (error) {
			resolvedValue = null;
		}
		return setJsonValueToSassValue(resolvedValue);
	}

	return {
		'json-encode($data, $quotes: true)': encode,
		'json-decode($string)': decode
	};
}
