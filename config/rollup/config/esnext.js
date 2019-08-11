const path = require("path");
const babel = require("rollup-plugin-babel");
const json = require("rollup-plugin-json");
const commonjs = require("rollup-plugin-commonjs");
const resolve = require("rollup-plugin-resolve2");
const banner = require("../utils/banner");

module.exports = () => {
	const cwd = process.cwd();
	const pkg = require(path.resolve(cwd, "package.json"));
	return [
		{
			input: "src/index.js",
			external: [
				...Object.keys(pkg.dependencies || {}),
				...Object.keys(pkg.peerDependencies || {})
			],
			output: [
				{
					banner: banner(pkg),
					file: `dist/${pkg.main}`,
					format: "cjs"
				},
				{
					banner: banner(pkg),
					file: pkg.module,
					format: "esm"
				}
			],
			plugins: [commonjs(), json(), resolve({extensions: [".mjs", ".jsx", ".js"]}), babel()]
		}
	];
};
