const ngineerDefaultConfig = require("@ngineer/config");
const cosmiconfig = require("cosmiconfig");
import execa from "execa";
import path from "path";
import {flags} from "./cli";

const babel = () => {
	const exploreNgineer = cosmiconfig("ngineer");
	const exploreBabel = cosmiconfig("babel");
	const babelConfig = exploreBabel.searchSync();
	const {config: ngineerCustomConfig} = exploreNgineer.searchSync() || {config: {}};
	const ngineer = {
		...ngineerDefaultConfig,
		...ngineerCustomConfig
	};
	const cwd = process.cwd();
	const LIB = path.resolve(cwd, ngineer.lib);
	const SRC = path.resolve(cwd, ngineer.src);
	const options = [SRC, "--out-dir", LIB];
	if (!babelConfig) {
		options.push("--config-file", "@ngineer/config-babel");
	} else {
		options.push("--extensions", ".ts,.tsx,.js,.jsx");
	}
	if (!flags.prod) {
		options.push("--source-maps");
	}
	if (flags.watch) {
		options.push("--watch");
	}
	execa("babel", options).stdout.pipe(process.stdout);
};

const rollup = () => {
	const options = [];
	if (flags.watch) {
		options.push("-cw");
	} else {
		options.push("-c");
	}
	execa("rollup", options).stdout.pipe(process.stdout);
};

const tsc = () => {
	const options = [];
	if (flags.watch) {
		options.push("--watch");
	}
	execa("tsc", options).stdout.pipe(process.stdout);
};

export default () => {
	if (flags.rollup) {
		rollup();
	} else if (flags.tsc) {
		tsc();
	} else {
		babel();
	}
};
