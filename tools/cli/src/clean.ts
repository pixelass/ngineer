import execa from "execa";
const ngineerDefaultConfig = require("@ngineer/config");
const cosmiconfig = require("cosmiconfig");
const explorer = cosmiconfig("ngineer");
import {input} from "./cli";

const {config: ngineerCustomConfig} = explorer.searchSync() || {config: {}};
const config = {
	...ngineerDefaultConfig,
	...ngineerCustomConfig
};
export default () =>
	execa("rimraf", [...input, ".rpt2_cache", config.lib, config.public]).stdout.pipe(
		process.stdout
	);
