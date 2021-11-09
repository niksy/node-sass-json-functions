import sass from 'sass';
import isPlainObject from 'is-plain-obj';
import parseColor from 'parse-color';
import parseUnit from 'parse-css-dimension';

/**
 * @typedef {import('../index').SassType} SassType
 * @typedef {import('../index').JsonValue} JsonValue
 * @typedef {import('../index').JsonObject} JsonObject
 * @typedef {import('../index').JsonArray} JsonArray
 */

const unitTypes = ['length', 'angle', 'resolution', 'frequency', 'time'];

/**
 * @param {string} value
 */
function isColor(value) {
	return typeof parseColor(value).rgba !== 'undefined';
}

/**
 * @param {string} value
 */
function parseValueToStringOrNumber(value) {
	let resolvedValue;
	try {
		const { value: parsedValue, unit, type } = parseUnit(value);
		if (unitTypes.includes(type)) {
			resolvedValue = new sass.types.Number(parsedValue, unit);
		} else if (type === 'percentage') {
			resolvedValue = new sass.types.Number(parsedValue, '%');
		} else {
			resolvedValue = new sass.types.String(value);
		}
	} catch (error) {
		resolvedValue = new sass.types.String(value);
	}
	return resolvedValue;
}

/**
 * @param {string} value
 */
function parseValueToColor(value) {
	const [r, g, b, a] = parseColor(value).rgba;
	return new sass.types.Color(r, g, b, a);
}

/**
 * @param {JsonValue} value
 */
function setJsonValueToSassValue(value) {
	let resolvedValue;
	if (Array.isArray(value)) {
		resolvedValue = arrayToList(value);
	} else if (isPlainObject(value)) {
		resolvedValue = objectToMap(value);
	} else if (isColor(String(value))) {
		resolvedValue = parseValueToColor(String(value));
	} else if (typeof value === 'string') {
		resolvedValue = parseValueToStringOrNumber(value);
	} else if (typeof value === 'number') {
		resolvedValue = new sass.types.Number(value);
	} else if (typeof value === 'boolean') {
		resolvedValue = value
			? sass.types.Boolean.TRUE
			: sass.types.Boolean.FALSE;
	} else {
		resolvedValue = sass.types.Null.NULL;
	}
	return resolvedValue;
}

/**
 * @param {JsonArray} array
 */
function arrayToList(array) {
	const length = array.length;
	const data = new sass.types.List(length);
	for (const [index, item] of array.entries()) {
		data.setValue(index, setJsonValueToSassValue(item));
	}
	return data;
}

/**
 * @param {JsonObject} object
 */
function objectToMap(object) {
	const length = Object.keys(object).length;
	const data = new sass.types.Map(length);
	for (const [index, [property, value = null]] of Object.entries(
		object
	).entries()) {
		data.setKey(index, setJsonValueToSassValue(property));
		data.setValue(index, setJsonValueToSassValue(value));
	}
	return data;
}

export default setJsonValueToSassValue;
