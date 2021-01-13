import sassTrue from 'sass-true';
import function_ from '../index';

sassTrue.runSass(
	{
		file: './test/custom-options.scss',
		functions: { ...function_ },
		precision: 2
	},
	{ describe, it }
);
