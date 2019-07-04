module.exports = {
	extends: "./esnext",
	presets: ["@babel/preset-react"],
	env: {
		development: {
			plugins: ["react-hot-loader/babel"]
		}
	}
};
