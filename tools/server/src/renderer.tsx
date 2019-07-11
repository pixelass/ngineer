import ngineerDefaultConfig from "@ngineer/config";
import cosmiconfig from "cosmiconfig";
import express from "express";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {StaticRouter} from "react-router";
import Document from "./template";

export type Renderer = () => (
	request: express.Request,
	response: express.Response
) => express.Response | string;

const serverRenderer: Renderer = () => (request, response) => {
	const isServer = typeof response === "object" && typeof response.send === "function";
	const explorer = cosmiconfig("ngineer");
	const {config: ngineerCustomConfig} = explorer.searchSync();
	const ngineer = {
		...ngineerDefaultConfig,
		...ngineerCustomConfig
	};
	const cwd = process.cwd();
	const LIB = path.resolve(cwd, ngineer.lib);
	const APP = path.resolve(LIB, ngineer.app);
	const {App} = require(APP);
	const app = ReactDOMServer.renderToStaticMarkup(
		<StaticRouter location={request.url} context={{}}>
			<App />
		</StaticRouter>
	);
	const html = `<!doctype html>${ReactDOMServer.renderToStaticMarkup(<Document lang="en" app={app} isServer={isServer} />)}`;
	if (isServer) {
		return response.send(html);
	}
	return html;
};

export default serverRenderer;
