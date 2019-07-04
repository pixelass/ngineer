const ngineerDefaultConfig = require("@ngineer/config");
const cosmiconfig = require("cosmiconfig");
const merge = require("webpack-merge");
const common = require("./common.js");
const explorer = cosmiconfig("ngineer");

module.exports = (env, argv) => {
	const {config: ngineerCustomConfig} = explorer.searchSync();
	const {public: publicPath, api} = {
		...ngineerDefaultConfig,
		...ngineerCustomConfig
	};
	const apiProxy = api
		? {
				[api.path]: {
					target: api.target,
					pathRewrite: {[`^${api.path}`]: ""},
					secure: false
				}
		  }
		: {};
	return merge(common(env, argv), {
		devtool: "inline-source-map",
		devServer: {
			host: "localhost",
			compress: false,
			historyApiFallback: true,
			hot: true,
			https: true,
			inline: true,
			port: 3000,
			contentBase: `/${publicPath}`,
			publicPath: "/",
			proxy: {
				...apiProxy,
				"/": {
					target: "https://localhost:8080",
					secure: false
				}
			}
		},
		mode: "development"
	});
};
