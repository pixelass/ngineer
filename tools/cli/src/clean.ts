import ngineerDefaultConfig from "@ngineer/config";
import cosmiconfig from "cosmiconfig";
import execa from "execa";
import {input} from "./cli";

const explorer = cosmiconfig("ngineer");

const {config: ngineerCustomConfig} = explorer.searchSync() || {config: {}};
const config = {
	...ngineerDefaultConfig,
	...ngineerCustomConfig
};
export default () =>
	execa("rimraf", [...input, ".rpt2_cache", config.lib, config.public]).stdout.pipe(
		process.stdout
	);
