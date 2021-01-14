import sass from 'sass';
import round from 'round-to';
import rgbHex from 'rgb-hex';
import shortHexColor from 'shorten-css-hex';

const { types } = sass;

/**
 * @param {sass.types.*} value
 *
 * @returns {*}
 */
function getJsonValueFromSassValue(value) {
	let rgbValue = [];
	let resolvedValue, alphaValue;
	if (value instanceof types.List) {
		resolvedValue = listToArray(value);
	} else if (value instanceof types.Map) {
		resolvedValue = mapToObject(value);
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
				round(Number(value.getValue()), 0) + value.getUnit()
			);
		} else {
			resolvedValue = round(Number(value.getValue()), 0);
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
 *
 * @returns {Array}
 */
function listToArray(list) {
	const length = list.getLength();
	const data = [];
	for (const index of Array.from({ length }).keys()) {
		const value = getJsonValueFromSassValue(list.getValue(index));
		data.push(value);
	}
	return data;
}

/**
 * @param {sass.types.Map} map
 *
 * @returns {object}
 */
function mapToObject(map) {
	const length = map.getLength();
	const data = {};
	for (const index of Array.from({ length }).keys()) {
		const key = map.getKey(index).getValue();
		const value = getJsonValueFromSassValue(map.getValue(index));
		data[key] = value;
	}
	return data;
}

export default getJsonValueFromSassValue;
