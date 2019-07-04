import express from "express";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {StaticRouter} from "react-router";
import {ServerStyleSheet, StyleSheetManager} from "styled-components";
import {Document} from "./template";

export type Render = (
	request: express.Request,
	response: express.Response
) => express.Response | string;

export type Renderer = () => Render;

export const renderSSR: Render = (request, response) => {
	const isServer = typeof response === "object" && typeof response.send === "function";
	const {default: App} = require(path.resolve(process.cwd(), "lib/app"));
	const sheet = new ServerStyleSheet();
	const app = ReactDOMServer.renderToString(
		<StyleSheetManager sheet={sheet.instance}>
			<StaticRouter location={request.url} context={{}}>
				<App />
			</StaticRouter>
		</StyleSheetManager>
	);
	const styles = sheet.getStyleTags();
	const html = `<!doctype html>${ReactDOMServer.renderToString(
		<Document styles={styles} app={app} isServer={isServer}/>
	).replace(` data-reactroot=""`, "")}`;
	if (isServer) {
		return response.send(html);
	}
	return html;
};
export const serverRenderer: Renderer = () => renderSSR;
