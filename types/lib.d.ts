declare module 'shorten-css-hex' {
	function main (string: string): string
	export = main;
}

declare module 'parse-css-dimension' {
	type ParsedValue = {
		value: number,
		unit: string,
		type: string,
	};
	function main (value: string): ParsedValue
	export = main;
}
