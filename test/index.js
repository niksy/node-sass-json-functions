import assert from 'node:assert';
import * as sass from 'sass';
import { parse } from 'sass-true';
import createJsonFunctions from '../index.js';

const result = sass.compile('./test/index.scss', {
	functions: { ...createJsonFunctions(sass) },
	loadPaths: ['node_modules'],
	importers: [new sass.NodePackageImporter()],
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
