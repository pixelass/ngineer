const path = require("path");
const babel = require("rollup-plugin-babel");
const json = require("rollup-plugin-json");
const commonjs = require("rollup-plugin-commonjs");
const typescript = require("rollup-plugin-typescript2");
const createBanner = require("../utils/banner");

const getPlugins = tsconfig => [
	commonjs(),
	json(),
	babel(),
	typescript({
		tsconfig,
		tsconfigOverride: {
			compilerOptions: {
				module: "es6"
			}
		}
	})
];

exports.getPlugins = getPlugins;
exports.json = json;
exports.typescript = typescript;
exports.createBanner = createBanner;

exports.config = () => {
	const cwd = process.cwd();
	const pkg = require(path.resolve(cwd, "package.json"));
	const tsconfig = path.resolve(cwd, "tsconfig.json");
	return [
		{
			input: "src/index.ts",
			external: [
				...Object.keys(pkg.dependencies || {}),
				...Object.keys(pkg.peerDependencies || {})
			],
			output: [
				{
					banner: createBanner(pkg),
					file: `dist/${pkg.main}`,
					format: "cjs"
				},
				{
					banner: createBanner(pkg),
					file: pkg.module,
					format: "esm"
				}
			],
			plugins: getPlugins(tsconfig)
		}
	];
};
