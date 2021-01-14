import sass from 'node-sass';
import { isArray, isPlainObject, isString, isNumber, isBoolean } from 'lodash';
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
		resolvedUnitValue = parseUnit(value);
		if (unitTypes.indexOf(resolvedUnitValue.type) !== -1) {
			resolvedValue = new types.Number(
				resolvedUnitValue.value,
				resolvedUnitValue.unit
			);
		} else if (resolvedUnitValue.type === 'percentage') {
			resolvedValue = new types.Number(resolvedUnitValue.value, '%');
		} else {
			resolvedValue = new types.String(resolvedUnitValue.value);
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
	if (isArray(value)) {
		resolvedValue = arrayToList(value);
	} else if (isPlainObject(value)) {
		resolvedValue = objectToMap(value);
	} else if (isColor(value)) {
		resolvedValue = parseValueToColor(value);
	} else if (isString(value)) {
		resolvedValue = parseValueToStringOrNumber(value);
	} else if (isNumber(value)) {
		resolvedValue = new types.Number(value);
	} else if (isBoolean(value)) {
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
	for (let index = 0; index < length; index++) {
		data.setValue(index, setJsonValueToSassValue(array[index]));
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
	let index = 0;
	for (let property in object) {
		if (object.hasOwnProperty(property)) {
			data.setKey(index, setJsonValueToSassValue(property));
			data.setValue(index, setJsonValueToSassValue(object[property]));
			index++;
		}
	}
	return data;
}

export default setJsonValueToSassValue;
