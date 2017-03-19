'use strict';

var sass = require('node-sass');
var round = require('lodash').round;
var rgbHex = require('rgb-hex');
var shortHexColor = require('shorten-css-hex');
var types = sass.types;

/**
 * @param  {sass.types.*} value
 * @param  {Object} opts
 *
 * @return {Mixed}
 */
function getJsonValueFromSassValue ( value, opts ) {
	var rgbValue = [];
	var resolvedValue, alphaValue;
	if ( value instanceof types.List ) {
		resolvedValue = listToArray(value, opts);
	} else if ( value instanceof types.Map ) {
		resolvedValue = mapToObject(value, opts);
	} else if ( value instanceof types.Color ) {
		rgbValue = [value.getR(), value.getG(), value.getB()];
		alphaValue = value.getA();
		if ( alphaValue === 1 ) {
			resolvedValue = shortHexColor(`#${rgbHex.apply(null, rgbValue)}`);
		} else {
			resolvedValue = `rgba(${rgbValue.join(',')},${alphaValue})`;
		}
	} else if ( value instanceof types.Number ) {
		if ( value.getUnit() !== '' ) {
			resolvedValue = String(round(Number(value.getValue()), opts.precision) + value.getUnit());
		} else {
			resolvedValue = round(Number(value.getValue()), opts.precision);
		}
	} else {
		try {
			resolvedValue = value.getValue();
		} catch ( e ) {
			resolvedValue = null;
		}
	}
	return resolvedValue;
}

/**
 * @param  {sass.types.List} list
 * @param  {Object} opts
 *
 * @return {Array}
 */
function listToArray ( list, opts ) {
	var length = list.getLength();
	var data = [];
	var value;
	for ( let i = 0; i < length; i++ ) {
		value = getJsonValueFromSassValue(list.getValue(i), opts);
		data.push(value);
	}
	return data;
}

/**
 * @param  {sass.types.Map} map
 * @param  {Object} opts
 *
 * @return {Object}
 */
function mapToObject ( map, opts ) {
	var length = map.getLength();
	var data = {};
	var key, value;
	for ( let i = 0; i < length; i++ ) {
		key = map.getKey(i).getValue();
		value = getJsonValueFromSassValue(map.getValue(i), opts);
		data[key] = value;
	}
	return data;
}

module.exports = {
	listToArray: listToArray,
	mapToObject: mapToObject,
	getJsonValueFromSassValue: getJsonValueFromSassValue
};
