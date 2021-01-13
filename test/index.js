import sassTrue from 'sass-true';
import function_ from '../index';

sassTrue.runSass(
	{
		file: './test/index.scss',
		functions: { ...function_ }
	},
	{ describe, it }
);
