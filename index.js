'use strict';

var sass = require('node-sass');
var isArray = require('lodash').isArray;
var isPlainObject = require('lodash').isPlainObject;
var isString = require('lodash').isString;
var isNumber = require('lodash').isNumber;
var isBoolean = require('lodash').isBoolean;
var round = require('lodash').round;
var rgbHex = require('rgb-hex');
var shortHexColor = require('shorten-css-hex');
var parseColor = require('parse-color');
var parseUnit = require('parse-css-dimension');
var types = sass.types;

function isColor ( value ) {
	return typeof parseColor(value).rgba !== 'undefined';
}

function getJsonValueFromSassValue ( value, opts ) {
	var resolvedValue = null;
	var rgbValue = [];
	var alphaValue;
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
	} else if ( !(value instanceof types.Null) ) {
		resolvedValue = value.getValue();
	}
	return resolvedValue;
}

function setJsonValueToSassValue ( value ) {
	var resolvedValue = types.Null.NULL;
	var resolvedColorValue, resolvedUnitValue;
	if ( isArray(value) ) {
		resolvedValue = arrayToList(value);
	} else if ( isPlainObject(value) ) {
		resolvedValue = objectToMap(value);
	} else if ( isColor(value) ) {
		resolvedColorValue = parseColor(value).rgba;
		resolvedValue = new types.Color(resolvedColorValue[0], resolvedColorValue[1], resolvedColorValue[2], resolvedColorValue[3]);
	} else if ( isString(value) ) {
		try {
			resolvedUnitValue = parseUnit(value);
			if ( resolvedUnitValue.type === 'length' ) {
				resolvedValue = new types.Number(resolvedUnitValue.value, resolvedUnitValue.unit);
			} else if ( resolvedUnitValue.type === 'percentage' ) {
				resolvedValue = new types.Number(resolvedUnitValue.value, '%');
			} else {
				resolvedValue = new types.String(resolvedUnitValue.value);
			}
		} catch ( e ) {
			resolvedValue = new types.String(value);
		}
	} else if ( isNumber(value) ) {
		resolvedValue = new types.Number(value);
	} else if ( isBoolean(value) ) {
		resolvedValue = value ? types.Boolean.TRUE : types.Boolean.FALSE;
	}
	return resolvedValue;
}

function arrayToList ( arr ) {
	var length = arr.length;
	var data = new types.List(length);
	for ( let i = 0; i < length; i++ ) {
		data.setValue(i, setJsonValueToSassValue(arr[i]));
	}
	return data;
}

function objectToMap ( obj ) {
	var length = Object.keys(obj).length;
	var data = new types.Map(length);
	var i = 0;
	for ( let prop in obj ) {
		if ( obj.hasOwnProperty(prop) ) {
			data.setKey(i, setJsonValueToSassValue(prop));
			data.setValue(i, setJsonValueToSassValue(obj[prop]));
			i++;
		}
	}
	return data;
}

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

/**
 * @param  {sass.types.*} value
 * @param  {Boolean|sass.types.Boolean} quotes
 *
 * @return {sass.types.String}
 */
function encode ( value, quotes ) {
	var shouldQuote = quotes.getValue();
	var resolvedValue = JSON.stringify(getJsonValueFromSassValue(value, { precision: this.options.precision }));
	if ( shouldQuote ) {
		resolvedValue = `'${resolvedValue}'`;
	}
	return new types.String(resolvedValue);
}

/**
 * @param  {sass.types.String|sass.types.Number|sass.types.Boolean|sass.types.Null} value
 *
 * @return {sass.types.*}
 */
function decode ( value ) {
	var resolvedValue = {};
	try {
		resolvedValue = JSON.parse(value.getValue());
	} catch ( e ) {
		resolvedValue = null;
	}
	return setJsonValueToSassValue(resolvedValue);
}

module.exports.encode = encode;
module.exports.decode = decode;

module.exports = {
	'json-encode($value, $quotes: true)': encode,
	'json-decode($value)': decode
};
