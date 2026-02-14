import rgbHex from 'rgb-hex';
import shortHexColor from 'shorten-css-hex';

/**
 * @import {JsonObject, JsonArray} from '../index.js'
 * @import {SassModule, Sass, SassCompilers} from '../lib/types.js'
 */

/**
 * @param {SassModule} sass
 * @param {SassCompilers=} compilers
 */
function createGetJsonValueFromSassValue(sass, compilers) {
	/**
	 * @param {Sass.Value|undefined} value
	 */
	function getJsonValueFromSassValue(value) {
		let resolvedValue;
		if (value instanceof sass.SassList) {
			resolvedValue = listToArray(value);
		} else if (value instanceof sass.SassMap) {
			resolvedValue = mapToObject(value);
		} else if (value instanceof sass.SassColor) {
			/** @type {[number, number, number]} */
			const rgbValue = [value.channel('red'), value.channel('green'), value.channel('blue')];
			const alphaValue = value.alpha;
			if (alphaValue === 1) {
				resolvedValue = shortHexColor(`#${rgbHex.apply(null, rgbValue)}`);
			} else {
				resolvedValue = `rgba(${rgbValue.join(',')},${alphaValue})`;
			}
		} else if (value instanceof sass.SassNumber) {
			if (value.hasUnits) {
				resolvedValue = String(value.value) + value.numeratorUnits.last();
			} else {
				resolvedValue = Number(value.value);
			}
		} else if (value instanceof sass.SassString) {
			resolvedValue = String(value.text);
		} else if (value instanceof sass.SassBoolean) {
			resolvedValue = Boolean(value.value);
		} else if (value instanceof sass.SassCalculation) {
			resolvedValue = sass.info.includes('sass-embedded')
				? toSassString(value, sass, compilers?.[0]).toString()
				: value.toString();
		} else if (typeof value === 'undefined') {
			resolvedValue = null;
		} else if (value.isTruthy) {
			resolvedValue = value.toString();
		} else if (value.realNull) {
			resolvedValue = null;
		}
		return resolvedValue ?? null;
	}

	/**
	 * Use Sass compiler to convert SassValue to SassString.
	 *
	 * Ref. Https://github.com/sass/embedded-host-node/issues/419#issuecomment-3872994933.
	 *
	 * @param  {Sass.Value} sassValue
	 * @param  {SassModule} sass
	 * @param  {SassCompilers[0]=} compiler
	 */
	function toSassString(sassValue, sass, compiler) {
		let result;
		(compiler ?? sass).compileString('$_: o(#{i()});', {
			functions: {
				'i()': (_) => sassValue,
				'o($i)': (arguments_) => {
					result = /** @type {Sass.SassString} */ (arguments_[0]);
					return result;
				}
			}
		});
		return /** @type {Sass.SassString} */ (/** @type {unknown} */ (result));
	}

	/**
	 * @param {Sass.SassList} list
	 */
	function listToArray(list) {
		const length = list.asList.size;
		/** @type {JsonArray} */
		const data = [];
		for (const index of Array.from({ length }).keys()) {
			const value = getJsonValueFromSassValue(list.get(index));
			data.push(value);
		}
		return data;
	}

	/**
	 * @param {Sass.SassMap} map
	 */
	function mapToObject(map) {
		const length = map.contents.size;
		/** @type {JsonObject} */
		const data = {};
		for (const index of Array.from({ length }).keys()) {
			const resolvedValue = map.get(index);
			if (typeof resolvedValue !== 'undefined') {
				const key = String(getJsonValueFromSassValue(resolvedValue.get(0)));
				const value = getJsonValueFromSassValue(resolvedValue.get(1));
				data[key] = value;
			}
		}
		return data;
	}

	return getJsonValueFromSassValue;
}

export default createGetJsonValueFromSassValue;
