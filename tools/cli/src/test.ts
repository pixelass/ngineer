import execa from "execa";
import {input, flags} from "./cli";

export default () => {
	const options = [];
	if (flags.update) {
		options.push("--update-snapshots");
	}
	if (flags.wacth) {
		options.push("--watch");
	}
	if (flags.cover) {
		execa("nyc", ["ava", ...options]).stdout.pipe(process.stdout);
	} else {
		execa("ava", [...input, ...options]).stdout.pipe(process.stdout);
	}
};
