'use strict';

const sass = require('node-sass');
const isArray = require('lodash').isArray;
const isPlainObject = require('lodash').isPlainObject;
const isString = require('lodash').isString;
const isNumber = require('lodash').isNumber;
const isBoolean = require('lodash').isBoolean;
const parseColor = require('parse-color');
const parseUnit = require('parse-css-dimension');
const types = sass.types;
const unitTypes = ['length', 'angle', 'resolution', 'frequency', 'time'];

/**
 * @param  {String}  value
 *
 * @return {Boolean}
 */
function isColor ( value ) {
	return typeof parseColor(value).rgba !== 'undefined';
}

/**
 * @param  {String} value
 *
 * @return {sass.types.String|sass.types.Number}
 */
function parseValueToStringOrNumber ( value ) {
	let resolvedValue, resolvedUnitValue;
	try {
		resolvedUnitValue = parseUnit(value);
		if ( unitTypes.indexOf(resolvedUnitValue.type) !== -1 ) {
			resolvedValue = new types.Number(resolvedUnitValue.value, resolvedUnitValue.unit);
		} else if ( resolvedUnitValue.type === 'percentage' ) {
			resolvedValue = new types.Number(resolvedUnitValue.value, '%');
		} else {
			resolvedValue = new types.String(resolvedUnitValue.value);
		}
	} catch ( e ) {
		resolvedValue = new types.String(value);
	}
	return resolvedValue;
}

/**
 * @param  {String} value
 *
 * @return {sass.types.Color}
 */
function parseValueToColor ( value ) {
	const resolvedColorValue = parseColor(value).rgba;
	return new types.Color(resolvedColorValue[0], resolvedColorValue[1], resolvedColorValue[2], resolvedColorValue[3]);
}

/**
 * @param {Mixed} value
 *
 * @return {sass.type.*}
 */
function setJsonValueToSassValue ( value ) {
	let resolvedValue = types.Null.NULL;
	if ( isArray(value) ) {
		resolvedValue = arrayToList(value);
	} else if ( isPlainObject(value) ) {
		resolvedValue = objectToMap(value);
	} else if ( isColor(value) ) {
		resolvedValue = parseValueToColor(value);
	} else if ( isString(value) ) {
		resolvedValue = parseValueToStringOrNumber(value);
	} else if ( isNumber(value) ) {
		resolvedValue = new types.Number(value);
	} else if ( isBoolean(value) ) {
		resolvedValue = value ? types.Boolean.TRUE : types.Boolean.FALSE;
	}
	return resolvedValue;
}

/**
 * @param  {Array} arr
 *
 * @return {sass.types.List}
 */
function arrayToList ( arr ) {
	const length = arr.length;
	const data = new types.List(length);
	for ( let i = 0; i < length; i++ ) {
		data.setValue(i, setJsonValueToSassValue(arr[i]));
	}
	return data;
}

/**
 * @param  {Object} obj
 *
 * @return {sass.types.Map}
 */
function objectToMap ( obj ) {
	const length = Object.keys(obj).length;
	const data = new types.Map(length);
	let i = 0;
	for ( let prop in obj ) {
		if ( obj.hasOwnProperty(prop) ) {
			data.setKey(i, setJsonValueToSassValue(prop));
			data.setValue(i, setJsonValueToSassValue(obj[prop]));
			i++;
		}
	}
	return data;
}

module.exports = setJsonValueToSassValue;
