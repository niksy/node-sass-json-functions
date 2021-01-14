import sass from 'sass';
import isPlainObject from 'is-plain-obj';
import parseColor from 'parse-color';
import parseUnit from 'parse-css-dimension';

const { types } = sass;
const unitTypes = ['length', 'angle', 'resolution', 'frequency', 'time'];

/**
 * @param  {string}  value
 *
 * @returns {boolean}
 */
function isColor(value) {
	return typeof parseColor(value).rgba !== 'undefined';
}

/**
 * @param  {string} value
 *
 * @returns {sass.types.String|sass.types.Number}
 */
function parseValueToStringOrNumber(value) {
	let resolvedValue, resolvedUnitValue;
	try {
		const { value: parsedValue, unit, type } = parseUnit(value);
		if (unitTypes.includes(type)) {
			resolvedValue = new types.Number(parsedValue, unit);
		} else if (type === 'percentage') {
			resolvedValue = new types.Number(parsedValue, '%');
		} else {
			resolvedValue = new types.String(value);
		}
	} catch (error) {
		resolvedValue = new types.String(value);
	}
	return resolvedValue;
}

/**
 * @param  {string} value
 *
 * @returns {sass.types.Color}
 */
function parseValueToColor(value) {
	const [r, g, b, a] = parseColor(value).rgba;
	return new types.Color(r, g, b, a);
}

/**
 * @param {*} value
 *
 * @returns {sass.type.*}
 */
function setJsonValueToSassValue(value) {
	let resolvedValue = types.Null.NULL;
	if (Array.isArray(value)) {
		resolvedValue = arrayToList(value);
	} else if (isPlainObject(value)) {
		resolvedValue = objectToMap(value);
	} else if (isColor(value)) {
		resolvedValue = parseValueToColor(value);
	} else if (typeof value === 'string') {
		resolvedValue = parseValueToStringOrNumber(value);
	} else if (typeof value === 'number') {
		resolvedValue = new types.Number(value);
	} else if (typeof value === 'boolean') {
		resolvedValue = value ? types.Boolean.TRUE : types.Boolean.FALSE;
	}
	return resolvedValue;
}

/**
 * @param {Array} array
 * @returns {sass.types.List}
 */
function arrayToList(array) {
	const length = array.length;
	const data = new types.List(length);
	for (const [index, item] of array.entries()) {
		data.setValue(index, setJsonValueToSassValue(item));
	}
	return data;
}

/**
 * @param {object} object
 * @returns {sass.types.Map}
 */
function objectToMap(object) {
	const length = Object.keys(object).length;
	const data = new types.Map(length);
	for (const [index, [property, value]] of Object.entries(object).entries()) {
		data.setKey(index, setJsonValueToSassValue(property));
		data.setValue(index, setJsonValueToSassValue(object[property]));
	}
	return data;
}

export default setJsonValueToSassValue;
