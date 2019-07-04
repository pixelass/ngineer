module.exports = {
	extends: ["tslint:latest", "tslint-eslint-rules", "tslint-config-prettier"],
	rules: {
		"no-implicit-dependencies": true,
		"no-namespace": true,
		"no-submodule-imports": false,
		"interface-name": [true, "never-prefix"]
	}
};
