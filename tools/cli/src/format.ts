import execa from "execa";
import {input} from "./cli";

export default () => {
	execa("prettier", [...input, "--write"]).stdout.pipe(process.stdout);
};
