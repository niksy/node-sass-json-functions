// @ts-ignore `sass` may not be installed
import type SassPackage from 'sass';
// @ts-ignore `sass-embedded` may not be installed
import type SassEmbeddedPackage from 'sass-embedded';

// @ts-ignore `sass` may not be installed
type SassPackageType = typeof import('sass');
// @ts-ignore `sass-embedded` may not be installed
type SassEmbeddedPackageType = typeof import('sass-embedded');

type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false;

export namespace Sass {
	export type Exception =
		IsAny<SassEmbeddedPackage.Exception> extends false
			? SassEmbeddedPackage.Exception
			: SassPackage.Exception;
	export type Logger =
		IsAny<SassEmbeddedPackage.Logger> extends false
			? SassEmbeddedPackage.Logger
			: SassPackage.Logger;
	export type LoggerWarnOptions =
		IsAny<SassEmbeddedPackage.LoggerWarnOptions> extends false
			? SassEmbeddedPackage.LoggerWarnOptions
			: SassPackage.LoggerWarnOptions;
	export type CompileResult =
		IsAny<SassEmbeddedPackage.CompileResult> extends false
			? SassEmbeddedPackage.CompileResult
			: SassPackage.CompileResult;
	export type Options<T extends 'sync' | 'async'> =
		IsAny<SassEmbeddedPackage.Options<T>> extends false
			? SassEmbeddedPackage.Options<T>
			: SassPackage.Options<T>;
	export type StringOptions<T extends 'sync' | 'async'> =
		IsAny<SassEmbeddedPackage.StringOptions<T>> extends false
			? SassEmbeddedPackage.StringOptions<T>
			: SassPackage.StringOptions<T>;
	export type Value =
		IsAny<SassEmbeddedPackage.Value> extends false
			? SassEmbeddedPackage.Value
			: SassPackage.Value;
	export type SassString =
		IsAny<SassEmbeddedPackage.SassString> extends false
			? SassEmbeddedPackage.SassString
			: SassPackage.SassString;
	export type SassList =
		IsAny<SassEmbeddedPackage.SassList> extends false
			? SassEmbeddedPackage.SassList
			: SassPackage.SassList;
	export type SassMap =
		IsAny<SassEmbeddedPackage.SassMap> extends false
			? SassEmbeddedPackage.SassMap
			: SassPackage.SassMap;
	export type CalculationOperator =
		IsAny<SassEmbeddedPackage.CalculationOperator> extends false
			? SassEmbeddedPackage.CalculationOperator
			: SassPackage.CalculationOperator;
	export type CalculationValue =
		IsAny<SassEmbeddedPackage.CalculationValue> extends false
			? SassEmbeddedPackage.CalculationValue
			: SassPackage.CalculationValue;
}

export type SassModule =
	IsAny<SassEmbeddedPackageType> extends false ? SassEmbeddedPackageType : SassPackageType;
