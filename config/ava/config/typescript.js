export default {
	compileEnhancements: false,
	require: ["ts-node/register"],
	extensions: ["ts", "tsx"],
	files: ["test/**/*.ts", "test/**/*.tsx", "!test/**/*.d.ts"]
};
