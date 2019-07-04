import execa from "execa";

export default () => {
	execa("nodemon", ["server"]).stdout.pipe(process.stdout);
};
