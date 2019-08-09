import execa from "execa";
import {flags, input} from "./cli";

export default () =>
	execa(
		"tslint",
		["-c", "tslint.json", ...input, flags.fix && "--fix"].filter(Boolean)
	).stdout.pipe(process.stdout);
