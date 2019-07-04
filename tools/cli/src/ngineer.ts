import clean from "./clean";
import {cmd, flags} from "./cli";
import {setEnv} from "./env";
import format from "./format";
import lint from "./lint";
import nodemon from "./nodemon";
import pack from "./pack";
import stylelint from "./stylelint";
import test from "./test";
import tslint from "./tslint";
import build from "./webpack";
import devServer from "./webpack-dev-server";

setEnv({
	NODE_ENV: flags.prod ? "production" : "development"
});

(() => {
	switch (cmd) {
		case "build":
			build();
			break;
		case "clean":
			clean();
			break;
		case "dev-server":
			nodemon();
			devServer();
			break;
		case "format":
			format();
			break;
		case "lint":
			lint();
			break;
		case "pack":
			pack();
			break;
		case "stylelint":
			stylelint();
			break;
		case "test":
			test();
			break;
		case "tslint":
			tslint();
			break;
		case undefined:
			pack();
			break;
		default:
			console.error(`ngineer "${cmd}" (invalid command)`);
			break;
	}
})();
