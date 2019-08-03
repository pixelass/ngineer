const execa = require("execa");
const fs = require("fs");
const githubUsername = require("github-username");
const mkdirp = require("mkdirp");
const ora = require("ora");
const path = require("path");
const pify = require("pify");
const {version: cliVersion} = require("@ngineer/cli/package.json");
const {version: configsVersion} = require("@ngineer/configs/package.json");

const {writeFile} = pify(fs);
const mkdir = pify(mkdirp);
const spinner = ora(`Creating ngineer app`);

const withTS = (ts, value, fallback = "") => (ts ? value : fallback);

const getVersion = async (packageName, fallbackVersion = "latest") => {
	let version = fallbackVersion;
	try {
		version = (await execa("npm", ["show", packageName, "version"])).stdout;
	} catch (err) {
		spinner.text = `Cannot find version for ${packageName}. Falling back to "latest"`;
	}
	spinner.text = `Using ${packageName}@${version}`;
	return version;
};

const CREATE_BABEL = ts => `module.exports = {
	"extends": "@ngineer/config-babel/${withTS(ts, "ts-")}react"
};
`;

const POSTCSS = `module.exports = require("@ngineer/config-postcss");
`;

const PRETTIER = `module.exports = require("@ngineer/config-prettier");
`;

const CREATE_AVA = ts => `import config from "@ngineer/config-ava/${withTS(
	ts,
	"typescript",
	"es"
)}";
export default config;
`;

const SERVER = `const {Server} = require("@ngineer/server");

const server = new Server();
server.start();
`;

const CREATE_PACKAGE = async ({git, pkg: {name, description}, ts}) =>
	JSON.stringify(
		{
			name,
			version: "0.1.0",
			description,
			repository: `git@github.com:${git.username}/${name}.git`,
			license: "MIT",
			author: `${git.name} <${git.email}>`,
			main: "server.js",
			scripts: {
				build: "ngineer build -p",
				clean: "ngineer clean",
				dev: "concurrently 'yarn serve:json' 'ngineer -w' 'ngineer dev-server'",
				flush: "node flush.js",
				lint: `ngineer lint 'src/**/*.{${withTS(ts, "ts,tsx", "js,jsx")},css}'`,
				prebuild: "yarn flush; yarn clean && ngineer -p",
				predev: "yarn flush; yarn clean && ngineer",
				prestart: "yarn flush; yarn build",
				"serve:json": "json-server --watch db.json --port 1337",
				"serve:public": "serve public",
				start: "yarn serve:public"
			},
			browserslist: [
				"last 2 chrome versions",
				"last 2 firefox versions",
				"last 2 safari versions",
				"last 2 ios versions"
			],
			dependencies: {
				...withTS(
					ts,
					{
						"@types/react": await getVersion("@types/react"),
						"@types/react-dom": await getVersion("@types/react-dom"),
						"@types/react-hot-loader": await getVersion("@types/react-hot-loader"),
						"@types/react-router": await getVersion("@types/react-router"),
						"@types/react-router-dom": await getVersion("@types/react-router-dom")
					},
					{}
				),

				react: await getVersion("react"),
				"react-dom": await getVersion("react-dom"),
				"react-hot-loader": await getVersion("react-hot-loader"),
				"react-router": await getVersion("react-router"),
				"react-router-dom": await getVersion("react-router-dom")
			},
			devDependencies: {
				"@ngineer/cli": cliVersion,
				"@ngineer/configs": configsVersion,
				concurrently: await getVersion("concurrently"),
				"html-react-parser": await getVersion("html-react-parser"),
				"html-webpack-plugin": await getVersion("html-webpack-plugin@next"),
				"json-server": await getVersion("json-server"),
				serve: await getVersion("serve"),
				"webpack-merge": await getVersion("webpack-merge")
			}
		},
		null,
		2
	);

const APP = `import React from "react";
import {hot} from "react-hot-loader/root";
import {Route, Switch} from "react-router";
import {routes} from "./routes";
import {NotFound} from "./pages";

const AppContent = () => (
	<Switch>
		{routes.map(({component, location}) => (
			<Route key={location} exact={true} path={location} component={component} />
		))}
		<Route component={NotFound} />
	</Switch>
);
export const App = hot(AppContent);
`;

const INDEX = `import {createElement} from "react";
import {hydrate} from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {App} from "./app";
import "./style.css";

const appRoot = document.querySelector("[data-app-root]");
const {classList} = document.documentElement;
classList.remove("no-js");
classList.add("js");

hydrate(createElement(BrowserRouter, null, createElement(App)), appRoot);
`;

const CREATE_ROUTES = ts => `import React from "react";
import {Home, NotFound} from "./pages";

${withTS(
	ts,
	`export interface Route {
	component: React.ComponentType<any>;
	location: string;
}

export type Routes = Route[];
`
)}
export const routes = [
	{
		component: Home,
		location: "/"
	},
	{
		component: NotFound,
		location: "/404"
	}
]${withTS(ts, " as Routes")};
`;

const PAGES_INDEX = `export * from "./home";
export * from "./not-found";
`;

const CREATE_PAGES_HOME = ts => `import React from "react";

${withTS(
	ts,
	`export interface HomeState {
	name?: string;
}
`
)}
export class Home extends React.Component {
	${withTS(ts, "public ")}state${withTS(ts, ": HomeState")} = {};
	${withTS(ts, "public ")}componentDidMount() {
		fetch("/api/user")
			.then(res => res.json())
			.then(data => this.setState(data))
	}
	${withTS(ts, "public ")}render() {
		return (
			<div>
				<h1>Home</h1>
				{this.state.name && <h2>Hello {this.state.name}!</h2>}
			</div>
		);
	}
}
`;

const PAGES_NOT_FOUND = `import React from "react";

export const NotFound = () => <h1>404</h1>;
`;

const TSCONFIG = `{
  "extends": "@ngineer/config-typescript/react"
}
`;

const TSLINT = `{
  "extends": ["@ngineer/config-tslint"]
}
`;

const HUSKY = `module.exports = require("@ngineer/config-husky");
`;

const COMMITLINT = `module.exports = {
	extends: ["@ngineer/config-commitlint"]
};
`;

const NODEMON = `{
  "watch": ["./"],
  "ignore": ["./node_modules", "./**/test", "./src", "./.*"]
}
`;

const CREATE_NGINEER = ts => `module.exports = {
	...require("@ngineer/config"),
	index: "index.${withTS(ts, "ts", "js")}",
	api: {
		path: "/api",
		target: "http://localhost:1337"
	}
};
`;

const FLUSH = `
const {writeFile} = require("fs");
const path = require("path");

const DATA = {
	"user": {
		"name": "John Doe"
	}
};

writeFile(path.resolve(__dirname, "db.json"), JSON.stringify(DATA, null, 2), "utf-8", err => {
	if (err) {
		console.error(err);
	}
});
`;

const STYLE = `body {
	margin: 0;
	font-family:
		-apple-system,
		BlinkMacSystemFont,
		"Segoe UI",
		Roboto,
		Oxygen-Sans,
		Ubuntu,
		Cantarell,
		"Helvetica Neue",
		sans-serif;
}
*,
*::before,
*::after {
	box-sizing: border-box;
}
`;

const README = `# Ngineer App

This app was bootstrapped with \`create-ngineer-app\`
`;

const GITIGNORE = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/

# TypeScript v1 declaration files
typings/

# TypeScript cache
*.tsbuildinfo

# Rollup cache
.rpt2_cache

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
`;

const WEBPACK_DEV = `module.exports = require("@ngineer/config-webpack/development");
`;

const WEBPACK_PROD = `const config = require("@ngineer/config-webpack/production");
const {renderer} = require("@ngineer/server");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const merge = require("webpack-merge");
const {routes} = require("./lib/routes");

module.exports = (env, argv) =>
	merge(config(env, argv), {
		plugins: routes.map(
			({location: url}) =>
				new HtmlWebpackPlugin({
					filename: path.join(url, "index.html").replace(/^\\//, ""),
					templateContent: renderer({url})
				})
		)
	});
`;

module.exports = async function run({dirname, pkg, config: {typescript: ts}}) {
	spinner.start();

	const ext = {
		js: withTS(ts, "ts", "js"),
		jsx: withTS(ts, "tsx", "jsx")
	};

	const {stdout: name} = await execa("git", ["config", "user.name"]);
	const {stdout: email} = await execa("git", ["config", "user.email"]);
	const username = await githubUsername(email);

	const srcDir = path.join(dirname, "src");
	const pagesDir = path.join(srcDir, "pages");
	const assetsDir = path.join(dirname, "assets");

	spinner.text = "Creating directories";
	await Promise.all([mkdir(pagesDir), mkdir(assetsDir)]);

	spinner.text = "Creating files";
	if (ts) {
		await Promise.all([
			writeFile(path.resolve(dirname, "tsconfig.json"), TSCONFIG),
			writeFile(path.resolve(dirname, "tslint.json"), TSLINT)
		]);
	}
	await Promise.all([
		writeFile(path.resolve(dirname, ".gitignore"), GITIGNORE),
		writeFile(path.resolve(dirname, "flush.js"), FLUSH),
		writeFile(path.resolve(dirname, "commitlint.config.js"), COMMITLINT),
		writeFile(path.resolve(dirname, ".huskyrc.js"), HUSKY),
		writeFile(path.resolve(dirname, "nodemon.json"), NODEMON),
		writeFile(path.resolve(dirname, "postcss.config.js"), POSTCSS),
		writeFile(path.resolve(dirname, ".prettierrc.js"), PRETTIER),
		writeFile(path.resolve(dirname, "README.md"), README),
		writeFile(path.resolve(dirname, "server.js"), SERVER),
		writeFile(path.resolve(dirname, "webpack.dev.js"), WEBPACK_DEV),
		writeFile(path.resolve(dirname, "webpack.prod.js"), WEBPACK_PROD),
		writeFile(path.resolve(dirname, "ava.config.js"), CREATE_AVA(ts)),
		writeFile(path.resolve(dirname, ".babelrc.js"), CREATE_BABEL(ts)),
		writeFile(path.resolve(dirname, ".ngineerrc.js"), CREATE_NGINEER(ts)),
		writeFile(
			path.resolve(dirname, "package.json"),
			await CREATE_PACKAGE({
				git: {
					name,
					email,
					username
				},
				pkg,
				ts
			})
		),

		writeFile(path.resolve(srcDir, `app.${ext.jsx}`), APP),
		writeFile(path.resolve(srcDir, `index.${ext.js}`), INDEX),
		writeFile(path.resolve(srcDir, `style.css`), STYLE),
		writeFile(path.resolve(srcDir, `routes.${ext.js}`), CREATE_ROUTES(ts)),

		writeFile(path.resolve(pagesDir, `index.${ext.js}`), PAGES_INDEX),
		writeFile(path.resolve(pagesDir, `not-found.${ext.jsx}`), PAGES_NOT_FOUND),
		writeFile(path.resolve(pagesDir, `home.${ext.jsx}`), CREATE_PAGES_HOME(ts))
	]);
	spinner.stop();
};
