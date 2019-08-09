import cosmiconfig from "cosmiconfig";
import execa from "execa";
import path from "path";
import {flags, input} from "./cli";

export default () => {
	const explorer = cosmiconfig("stylelint");
	const withConfig = explorer.searchSync();
	const options = [...input];
	if (flags.fix) {
		options.push("--fix");
	}
	if (!withConfig) {
		options.push("--config", path.resolve("@ngineer/config-stylelint"));
	}
	execa("stylelint", options).stdout.pipe(process.stdout);
};
