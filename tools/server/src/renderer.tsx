import ngineerDefaultConfig from "@ngineer/config";
import cosmiconfig from "cosmiconfig";
import express from "express";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {StaticRouter} from "react-router";
import Document from "./template";

export const toHTML = (js: React.ReactElement): string => ReactDOMServer.renderToStaticMarkup(js);
export const toHTML5 = (js: React.ReactElement): string => `<!doctype html>${toHTML(js)}`;

export type Renderer = () => (
	request: express.Request,
	response: express.Response
) => express.Response | string;

const explorer = cosmiconfig("ngineer");
const {config: ngineerCustomConfig} = explorer.searchSync();
export const ngineerConfig = {
	...ngineerDefaultConfig,
	...ngineerCustomConfig
};
export const cwd = process.cwd();
export const LIB = path.resolve(cwd, ngineerConfig.lib);
export const APP = path.resolve(LIB, ngineerConfig.app);
export const {App} = require(APP);

export const serverRenderer: Renderer = () => (request, response) => {
	const isServer = typeof response === "object" && typeof response.send === "function";
	const app = toHTML(
		<StaticRouter location={request.url} context={{}}>
			<App />
		</StaticRouter>
	);
	const html = toHTML5(<Document lang="en" app={app} isServer={isServer} />);
	if (isServer) {
		return response.send(html);
	}
	return html;
};
