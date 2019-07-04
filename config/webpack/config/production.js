const merge = require("webpack-merge");
const common = require("./common.js");

module.exports = (env, argv) => {
	return merge(common(env, argv), {
		mode: "production",
		devtool: false
	});
};
