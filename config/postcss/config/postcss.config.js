module.exports = {
	plugins: {
		"postcss-import": {},
		"postcss-preset-env": {},
		cssnano: process.env.NODE_ENV === "production" ? {} : null
	}
};
