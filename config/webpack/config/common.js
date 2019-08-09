const ngineerDefaultConfig = require("@ngineer/config");
const cosmiconfig = require("cosmiconfig");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const {ignorePlugin} = require("webpack");
const explorer = cosmiconfig("ngineer");
const CopyPlugin = require("copy-webpack-plugin");

const postcssOptions = {
	sourceMap: true,
	config: {
		ctx: {
			"postcss-preset-env": {},
			cssnano: {}
		}
	}
};

const extractcssOptions = {
	hmr: process.env.NODE_ENV !== "production"
};

const cssOptions = {
	sourceMap: true
};

const lessOptions = {
	sourceMap: true,
	strictMath: true,
	noIeCompat: true
};

const scssOptions = {
	sourceMap: true
};
const cssLoaders = [
	{
		loader: MiniCssExtractPlugin.loader,
		options: extractcssOptions
	},
	{
		loader: "css-loader",
		options: cssOptions
	},
	{
		loader: "postcss-loader",
		options: postcssOptions
	}
];

module.exports = (env, argv) => {
	const {config: ngineerCustomConfig} = explorer.searchSync();
	const {public: publicPath, src: srcPath, index: indexPath, assets: assetsPath} = {
		...ngineerDefaultConfig,
		...ngineerCustomConfig
	};
	const cwd = process.cwd();
	const SRC = path.resolve(cwd, srcPath);
	const INDEX = path.resolve(SRC, indexPath);
	const PUBLIC = path.resolve(cwd, publicPath);
	return {
		entry: INDEX,
		output: {
			path: PUBLIC,
			filename: "[name].js",
			libraryTarget: "umd",
			publicPath: "/"
		},
		resolve: {
			extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"],
			alias: {
				"react-dom": "@hot-loader/react-dom"
			}
		},
		module: {
			rules: [
				{
					test: /\.mjs$/,
					use: [
						{
							loader: "babel-loader"
						}
					]
				},
				{
					test: /\.jsx?$/,
					use: [
						{
							loader: "babel-loader"
						}
					]
				},
				{
					test: /\.tsx?$/,
					use: [
						{
							loader: "babel-loader"
						}
					]
				},
				{
					test: /\.css$/,
					use: cssLoaders
				},
				{
					test: /\.less$/,
					use: [
						...cssLoaders,
						{
							loader: "less-loader",
							options: lessOptions
						}
					]
				},
				{
					test: /\.scss$/,
					use: [
						...cssLoaders,
						{
							loader: "sass-loader",
							options: scssOptions
						}
					]
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: "[name].css",
				chunkName: "[id].css",
				allChunks: true
			}),
			new CopyPlugin([
				{from: path.resolve(cwd, assetsPath), to: path.resolve(PUBLIC, assetsPath)}
			])
		]
	};
};
