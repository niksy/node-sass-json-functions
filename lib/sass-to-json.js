import sass from 'sass';
import round from 'round-to';
import rgbHex from 'rgb-hex';
import shortHexColor from 'shorten-css-hex';

/**
 * @typedef {object} Options
 * @property {number} precision Number of digits after the decimal.
 */

/**
 * @typedef {import('../index').JsonValue} JsonValue
 * @typedef {import('../index').JsonObject} JsonObject
 * @typedef {import('../index').JsonArray} JsonArray
 */

/**
 * @param {sass.LegacyValue|undefined} value
 * @param {Options}                    options
 */
function getJsonValueFromSassValue(value, options) {
	let resolvedValue;
	if (value instanceof sass.types.List) {
		resolvedValue = listToArray(value, options);
	} else if (value instanceof sass.types.Map) {
		resolvedValue = mapToObject(value, options);
	} else if (value instanceof sass.types.Color) {
		/** @type {[number, number, number]} */
		const rgbValue = [value.getR(), value.getG(), value.getB()];
		const alphaValue = value.getA();
		if (alphaValue === 1) {
			resolvedValue = shortHexColor(`#${rgbHex.apply(null, rgbValue)}`);
		} else {
			resolvedValue = `rgba(${rgbValue.join(',')},${alphaValue})`;
		}
	} else if (value instanceof sass.types.Number) {
		if (value.getUnit() !== '') {
			resolvedValue = String(
				round(Number(value.getValue()), options.precision) +
					value.getUnit()
			);
		} else {
			resolvedValue = round(Number(value.getValue()), options.precision);
		}
	} else {
		try {
			if (typeof value !== 'undefined' && 'getValue' in value) {
				resolvedValue = value.getValue();
			} else {
				resolvedValue = null;
			}
		} catch (error) {
			resolvedValue = null;
		}
	}
	return resolvedValue;
}

/**
 * @param {sass.types.List} list
 * @param {Options}         options
 */
function listToArray(list, options) {
	const length = list.getLength();
	/** @type {JsonArray} */
	const data = [];
	for (const index of Array.from({ length }).keys()) {
		const value = getJsonValueFromSassValue(list.getValue(index), options);
		data.push(value);
	}
	return data;
}

/**
 * @param {sass.types.Map} map
 * @param {Options}        options
 */
function mapToObject(map, options) {
	const length = map.getLength();
	/** @type {JsonObject} */
	const data = {};
	for (const index of Array.from({ length }).keys()) {
		// @ts-ignore
		const key = String(map.getKey(index).getValue());
		const value = getJsonValueFromSassValue(map.getValue(index), options);
		data[key] = value;
	}
	return data;
}

export default getJsonValueFromSassValue;
