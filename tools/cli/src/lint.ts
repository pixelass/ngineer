import tslint from "./tslint";
import stylelint from "./stylelint";

export default () => {
	stylelint();
	tslint();
};
