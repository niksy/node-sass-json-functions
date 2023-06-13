import * as sass from 'sass';
import isPlainObject from 'is-plain-obj';
import parseColor from 'parse-color';
import parseUnit from 'parse-css-dimension';
import { OrderedMap } from 'immutable';

/**
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
			resolvedValue = new sass.SassNumber(parsedValue, unit);
		} else if (type === 'percentage') {
			resolvedValue = new sass.SassNumber(parsedValue, '%');
		} else {
			resolvedValue = new sass.SassString(value);
		}
	} catch (error) {
		resolvedValue = new sass.SassString(value);
	}
	return resolvedValue;
}

/**
 * @param {string} value
 */
function parseValueToColor(value) {
	const [red, green, blue, alpha] = parseColor(value).rgba;
	return new sass.SassColor({
		red,
		green,
		blue,
		alpha
	});
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
		resolvedValue = new sass.SassNumber(value);
	} else if (typeof value === 'boolean') {
		resolvedValue = value ? sass.sassTrue : sass.sassFalse;
	} else {
		resolvedValue = sass.sassNull;
	}
	return resolvedValue;
}

/**
 * @param {JsonArray} array
 */
function arrayToList(array) {
	/** @type {sass.Value[]} */
	const data = [];
	for (const item of array) {
		data.push(setJsonValueToSassValue(item));
	}
	return new sass.SassList(data);
}

/**
 * @param {JsonObject} object
 */
function objectToMap(object) {
	/** @type {[sass.Value, sass.Value][]} */
	const data = [];
	for (const [property, value = null] of Object.entries(object)) {
		data.push([
			setJsonValueToSassValue(property),
			setJsonValueToSassValue(value)
		]);
	}
	// eslint-disable-next-line new-cap
	return new sass.SassMap(OrderedMap(data));
}

export default setJsonValueToSassValue;
