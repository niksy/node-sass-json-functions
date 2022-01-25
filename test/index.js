// @ts-ignore
import sassTrue from 'sass-true';
import function_ from '../index.js';

sassTrue.runSass(
	{
		file: './test/index.scss',
		functions: { ...function_ }
	},
	{ describe, it }
);
