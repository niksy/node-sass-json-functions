import assert from 'node:assert';
import * as sassClassic from 'sass';
import * as sassEmbedded from 'sass-embedded';
import { parse } from 'sass-true';
import createJsonFunctions from '../index.js';

/**
 * @import {SassModule} from '../lib/types.js';
 */

/**
 * @param  {string} name
 * @param  {SassModule} sass
 */
function runSuite(name, sass) {
	const result = sass.compile('./test/index.scss', {
		functions: { ...createJsonFunctions(sass) },
		loadPaths: ['node_modules'],
		importers: [new sass.NodePackageImporter()],
		logger: sass.Logger.silent
	});

	const modules = parse(result.css);

	describe(name, function () {
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
	});
}

// @ts-ignore only one package type is picked up
runSuite('sass', sassClassic);
runSuite('sass-embedded', sassEmbedded);
