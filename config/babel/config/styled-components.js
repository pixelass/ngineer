module.exports = {
	extends: "./react",
	env: {
		development: {
			plugins: [
				[
					"styled-components",
					{
						ssr: true,
						displayName: true
					}
				]
			]
		},
		production: {
			plugins: [
				[
					"styled-components",
					{
						ssr: true,
						displayName: false
					}
				]
			]
		}
	}
};
