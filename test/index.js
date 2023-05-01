import assert from 'assert';
import sass from 'sass';
import { parse } from 'sass-true';
import function_ from '../index.js';

const result = sass.compile('./test/index.scss', {
	functions: { ...function_ },
	loadPaths: ['node_modules'],
	logger: sass.Logger.silent
});

const modules = parse(result.css);

modules.forEach(({ module: _module, tests = [] }) => {
	describe(_module, function () {
		tests.forEach(({ test, assertions }) => {
			it(test, function () {
				assertions.forEach(({ assertionType, output, expected }) => {
					if (assertionType === 'assert-equal') {
						assert.equal(output, expected);
					}
				});
			});
		});
	});
});
