import sass from 'sass';
import round from 'round-to';
import rgbHex from 'rgb-hex';
import shortHexColor from 'shorten-css-hex';

/**
 * @typedef {import('../index').SassType} SassType
 * @typedef {import('../index').JsonValue} JsonValue
 * @typedef {import('../index').JsonObject} JsonObject
 * @typedef {import('../index').JsonArray} JsonArray
 */

/**
 * @param {SassType} value
 */
function getJsonValueFromSassValue(value) {
	let resolvedValue;
	if (value instanceof sass.types.List) {
		resolvedValue = listToArray(value);
	} else if (value instanceof sass.types.Map) {
		resolvedValue = mapToObject(value);
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
				round(Number(value.getValue()), 0) + value.getUnit()
			);
		} else {
			resolvedValue = round(Number(value.getValue()), 0);
		}
	} else {
		try {
			if ('getValue' in value) {
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
 */
function listToArray(list) {
	const length = list.getLength();
	/** @type {JsonArray} */
	const data = [];
	for (const index of Array.from({ length }).keys()) {
		const value = getJsonValueFromSassValue(list.getValue(index));
		data.push(value);
	}
	return data;
}

/**
 * @param {sass.types.Map} map
 */
function mapToObject(map) {
	const length = map.getLength();
	/** @type {JsonObject} */
	const data = {};
	for (const index of Array.from({ length }).keys()) {
		const key = String(map.getKey(index).getValue());
		const value = getJsonValueFromSassValue(map.getValue(index));
		data[key] = value;
	}
	return data;
}

export default getJsonValueFromSassValue;
