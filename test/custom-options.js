var sassTrue = require('sass-true');
var fn = require('../');

sassTrue.runSass({
	file: './test/custom-options.scss',
	functions: Object.assign({}, fn),
	precision: 2
}, describe, it);
