import path from "path";
import execa from "execa";

export default () => {
	const cwd = process.cwd();
	execa("webpack", [
		"--config",
		path.resolve(cwd, "webpack.prod.js"),
		"--optimize-minimize"
	]).stdout.pipe(process.stdout);
	return;
};
