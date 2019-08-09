import path from "path";
import webpack, {HotModuleReplacementPlugin} from "webpack";
import WebpackDevServer from "webpack-dev-server";

export default () => {
	const cwd = process.cwd();
	const devOptions = require(path.resolve(cwd, "webpack.dev.js"))(process.env, process.argv);
	const {entry, devServer} = devOptions;
	const {host, port} = devServer;
	const protocol = devServer.https ? "https:" : "http:";
	devOptions.entry = [
		`webpack-dev-server/client?${protocol}//${host}:${port}`,
		"webpack/hot/dev-server",
		entry
	];
	devOptions.plugins.push(new HotModuleReplacementPlugin());

	const compiler = webpack(devOptions);
	const devServerOptions = {
		...devServer,
		stats: {
			colors: true
		}
	};
	const server = new WebpackDevServer(compiler, devServerOptions);
	server.listen(port, host, () => {
		// tslint:disable-next-line:no-console
		console.info(
			`Starting server on ${protocol}//${
				host
			}:${port}`
		);
	});
};
