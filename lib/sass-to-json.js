import sass from 'node-sass';
import { round } from 'lodash';
import rgbHex from 'rgb-hex';
import shortHexColor from 'shorten-css-hex';

const types = sass.types;

/**
 * @param {sass.types.*} value
 * @param {object} options
 *
 * @returns {*}
 */
function getJsonValueFromSassValue(value, options) {
	let rgbValue = [];
	let resolvedValue, alphaValue;
	if (value instanceof types.List) {
		resolvedValue = listToArray(value, options);
	} else if (value instanceof types.Map) {
		resolvedValue = mapToObject(value, options);
	} else if (value instanceof types.Color) {
		rgbValue = [value.getR(), value.getG(), value.getB()];
		alphaValue = value.getA();
		if (alphaValue === 1) {
			resolvedValue = shortHexColor(`#${rgbHex.apply(null, rgbValue)}`);
		} else {
			resolvedValue = `rgba(${rgbValue.join(',')},${alphaValue})`;
		}
	} else if (value instanceof types.Number) {
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
			resolvedValue = value.getValue();
		} catch (error) {
			resolvedValue = null;
		}
	}
	return resolvedValue;
}

/**
 * @param {sass.types.List} list
 * @param {object} options
 *
 * @returns {Array}
 */
function listToArray(list, options) {
	const length = list.getLength();
	const data = [];
	for (let index = 0; index < length; index++) {
		const value = getJsonValueFromSassValue(list.getValue(index), options);
		data.push(value);
	}
	return data;
}

/**
 * @param {sass.types.Map} map
 * @param {object} options
 *
 * @returns {object}
 */
function mapToObject(map, options) {
	const length = map.getLength();
	const data = {};
	for (let index = 0; index < length; index++) {
		const key = map.getKey(index).getValue();
		const value = getJsonValueFromSassValue(map.getValue(index), options);
		data[key] = value;
	}
	return data;
}

export default getJsonValueFromSassValue;
