import sass from 'sass';
import getJsonValueFromSassValue from './lib/sass-to-json';
import setJsonValueToSassValue from './lib/json-to-sass';

const types = sass.types;

/**
 * @param {sass.types.*} value
 * @param {boolean | sass.types.Boolean} quotes
 *
 * @returns {sass.types.String}
 */
function encode(value, quotes) {
	const shouldQuote = quotes.getValue();
	let resolvedValue = JSON.stringify(getJsonValueFromSassValue(value));
	if (shouldQuote) {
		resolvedValue = `'${resolvedValue}'`;
	}
	return new types.String(resolvedValue);
}

/**
 * @param {sass.types.String|sass.types.Number|sass.types.Boolean|sass.types.Null} value
 *
 * @returns {sass.types.*}
 */
function decode(value) {
	let resolvedValue = {};
	try {
		resolvedValue = JSON.parse(value.getValue());
	} catch (error) {
		resolvedValue = null;
	}
	return setJsonValueToSassValue(resolvedValue);
}

export default {
	'json-encode($value, $quotes: true)': encode,
	'json-decode($value)': decode
};
