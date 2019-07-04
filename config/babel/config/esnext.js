module.exports = {
	presets: ["@babel/preset-env"],
	plugins: [
		"@babel/plugin-proposal-class-properties",
		"@babel/plugin-proposal-object-rest-spread",
		[
			"transform-inline-environment-variables",
			{
				include: ["NODE_ENV"]
			}
		]
	]
};
