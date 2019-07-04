const config = require("@ngineer/config-webpack/production");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const merge = require("webpack-merge");
const {routes} = require("./lib/routes");
const {renderSSR} = require("./lib/server/renderer");

module.exports = (env, argv) =>
	merge(config(env, argv), {
		plugins: routes.map(
			({location: url}) =>
				new HtmlWebpackPlugin({
					filename: path.join(url, "index.html").replace(/^\//, ""),
					templateContent: renderSSR({url})
				})
		)
	});
