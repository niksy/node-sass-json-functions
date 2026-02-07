import createGetJsonValueFromSassValue from './lib/sass-to-json.js';
import createSetJsonValueToSassValue from './lib/json-to-sass.js';

/**
 * @import {SassModule, Sass} from './lib/types.js'
 */

/**
 * @typedef {JsonPrimitive | JsonObject | JsonArray} JsonValue
 * @typedef {JsonValue[]} JsonArray
 * @typedef {string | number | boolean | null} JsonPrimitive
 * @typedef {{[Key in string]?: JsonValue}} JsonObject
 */

/**
 * @param {SassModule} sass
 */
export default function createJsonFunctions(sass) {
	const getJsonValueFromSassValue = createGetJsonValueFromSassValue(sass);
	const setJsonValueToSassValue = createSetJsonValueToSassValue(sass);

	/**
	 * @param {Sass.Value[]} encodeArguments
	 * @returns {Sass.SassString}
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
	 * @param {Sass.Value[]} decodeArguments
	 * @returns {Sass.Value}
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
		/**
		 * Encodes (`JSON.stringify`) data and returns Sass string. By default, string is quoted with single quotes so that it can be easily used in standard CSS values.
		 *
		 * @param $data `sass.Value` - Data to encode (stringify).
		 * @param $qoutes `sass.SassBoolean` - Should output string be quoted with single quotes.
		 */
		'json-encode($data, $quotes: true)': encode,
		/**
		 * Decodes (`JSON.parse`) string and returns one of available Sass types.
		 *
		 * @param $string `sass.SassString` - String to decode (parse).
		 */
		'json-decode($string)': decode
	};
}
