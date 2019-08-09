import execa from "execa";
import path from "path";

export default () => {
	const cwd = process.cwd();
	execa("webpack", [
		"--config",
		path.resolve(cwd, "webpack.prod.js"),
		"--optimize-minimize"
	]).stdout.pipe(process.stdout);
	return;
};
