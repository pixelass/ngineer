import path from "path";
import webpack, {HotModuleReplacementPlugin} from "webpack";
import WebpackDevServer from "webpack-dev-server";

export default () => {
	const cwd = process.cwd();
	const devOptions = require(path.resolve(cwd, "webpack.dev.js"))(process.env, process.argv);
	const {entry} = devOptions;
	devOptions.entry = [
		`webpack-dev-server/client?https://${devOptions.devServer.host}:${devOptions.devServer.port}`,
		"webpack/hot/dev-server",
		entry
	];
	devOptions.plugins.push(new HotModuleReplacementPlugin());

	const compiler = webpack(devOptions);
	const devServerOptions = {
		...devOptions.devServer,
		stats: {
			colors: true
		}
	};
	const server = new WebpackDevServer(compiler, devServerOptions);
	server.listen(devServerOptions.port, devServerOptions.host, () => {
		console.info(
			`Starting server on ${devServerOptions.https ? "https" : "http"}://${
				devServerOptions.host
			}:${devServerOptions.port}`
		);
	});
};
