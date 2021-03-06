const path = require("path");
const {createBanner, getPlugins} = require("@ngineer/config-rollup/typescript");

module.exports = () => {
	const cwd = process.cwd();
	const pkg = require(path.resolve(cwd, "package.json"));
	const tsconfig = path.resolve(cwd, "tsconfig.json");
	return Object.entries(pkg.bin).map(([cmd, file]) => ({
		input: `src/${file.replace(/\.js$/, ".ts")}`,
		external: [
			...Object.keys(pkg.dependencies || {}),
			...Object.keys(pkg.peerDependencies || {})
		],
		output: [
			{
				banner: createBanner(pkg),
				file: `dist/bin/${file}`,
				format: "cjs"
			}
		],
		plugins: getPlugins(tsconfig)
	}));
};
