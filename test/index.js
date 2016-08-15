var sassTrue = require('sass-true');
var fn = require('../');

sassTrue.runSass({
	file: './test/index.scss',
	functions: Object.assign({}, fn)
}, describe, it);
