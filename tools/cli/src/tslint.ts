import execa from "execa";
import {input, flags} from "./cli";

export default () =>
	execa(
		"tslint",
		["-c", "tslint.json", ...input, flags.fix && "--fix"].filter(Boolean)
	).stdout.pipe(process.stdout);
