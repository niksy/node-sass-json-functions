import { SassList, SassMap, SassColor, SassNumber, SassString, SassBoolean } from 'sass';
import rgbHex from 'rgb-hex';
import shortHexColor from 'shorten-css-hex';

/**
 * @typedef {typeof import('sass')} sass
 * @typedef {import('../index.js').JsonValue} JsonValue
 * @typedef {import('../index.js').JsonObject} JsonObject
 * @typedef {import('../index.js').JsonArray} JsonArray
 */

/**
 * @param {sass.Value|undefined} value
 */
function getJsonValueFromSassValue(value) {
	let resolvedValue;
	if (value instanceof SassList) {
		resolvedValue = listToArray(value);
	} else if (value instanceof SassMap) {
		resolvedValue = mapToObject(value);
	} else if (value instanceof SassColor) {
		/** @type {[number, number, number]} */
		const rgbValue = [value.red, value.green, value.blue];
		const alphaValue = value.alpha;
		if (alphaValue === 1) {
			resolvedValue = shortHexColor(`#${rgbHex.apply(null, rgbValue)}`);
		} else {
			resolvedValue = `rgba(${rgbValue.join(',')},${alphaValue})`;
		}
	} else if (value instanceof SassNumber) {
		if (value.hasUnits) {
			resolvedValue = String(value.value) + value.numeratorUnits.last();
		} else {
			resolvedValue = Number(value.value);
		}
	} else if (value instanceof SassString) {
		resolvedValue = String(value.text);
	} else if (value instanceof SassBoolean) {
		resolvedValue = Boolean(value.value);
	} else if (typeof value === 'undefined') {
		resolvedValue = null;
	} else if (value.isTruthy) {
		resolvedValue = value.toString();
	} else if (value.realNull) {
		resolvedValue = null;
	}
	return resolvedValue ?? null;
}

/**
 * @param {sass.SassList} list
 */
function listToArray(list) {
	const length = list.asList.size;
	/** @type {JsonArray} */
	const data = [];
	for (const index of Array.from({ length }).keys()) {
		const value = getJsonValueFromSassValue(list.get(index));
		data.push(value);
	}
	return data;
}

/**
 * @param {sass.SassMap} map
 */
function mapToObject(map) {
	const length = map.contents.size;
	/** @type {JsonObject} */
	const data = {};
	for (const index of Array.from({ length }).keys()) {
		const resolvedValue = map.get(index);
		if (typeof resolvedValue !== 'undefined') {
			const key = String(getJsonValueFromSassValue(resolvedValue.get(0)));
			const value = getJsonValueFromSassValue(resolvedValue.get(1));
			data[key] = value;
		}
	}
	return data;
}

export default getJsonValueFromSassValue;
