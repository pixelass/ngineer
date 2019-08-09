const execa = require("execa");
const jsonServer = require("./json-server");

jsonServer(1337, server => {
	execa("concurrently", ["'serve public'", "'ngineer test'", "-k"]).then(() => {
		server.close(() => {
			console.log("JSON Server closed");
		});
	});
});
