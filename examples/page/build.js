const execa = require("execa");
const jsonServer = require("./json-server");

jsonServer(1337, server => {
	execa("ngineer", ["build", "-p"]).then(() => {
		server.close(() => {
			console.log("JSON Server closed");
		});
	});
});
