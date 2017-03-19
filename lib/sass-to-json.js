'use strict';

const sass = require('node-sass');
const round = require('lodash').round;
const rgbHex = require('rgb-hex');
const shortHexColor = require('shorten-css-hex');
const types = sass.types;

/**
 * @param  {sass.types.*} value
 * @param  {Object} opts
 *
 * @return {Mixed}
 */
function getJsonValueFromSassValue ( value, opts ) {
	let rgbValue = [];
	let resolvedValue, alphaValue;
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
	const length = list.getLength();
	const data = [];
	for ( let i = 0; i < length; i++ ) {
		const value = getJsonValueFromSassValue(list.getValue(i), opts);
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
	const length = map.getLength();
	const data = {};
	for ( let i = 0; i < length; i++ ) {
		const key = map.getKey(i).getValue();
		const value = getJsonValueFromSassValue(map.getValue(i), opts);
		data[key] = value;
	}
	return data;
}

module.exports = getJsonValueFromSassValue;
