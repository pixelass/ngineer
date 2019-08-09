const {createServer} = require("http");
const jsonServer = require("json-server");

module.exports = (port, callback) => {
	const app = jsonServer.create();
	const router = jsonServer.router("db.json");
	const middlewares = jsonServer.defaults();

	app.use(middlewares);
	app.use(router);
	const server = createServer(app);

	server.listen(1337, () => {
		console.log("JSON Server is running");
		callback(server);
	});
}
