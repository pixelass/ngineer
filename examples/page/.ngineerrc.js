const config = require("@ngineer/config");
module.exports = {
	...config,
	api: {
		path: "/api",
		target: "http://localhost:1337"
	},
	plugins: ["styled-components", "graphql"]
};
