import {INITIAL_STATE_PROP} from "@ngineer/graphql";
import {Head} from "@ngineer/head";
import {toHTML, toHTML5} from "@ngineer/server";
import express from "express";
import React from "react";
import {StaticRouter} from "react-router";
import {ServerStyleSheet, StyleSheetManager} from "styled-components";
import {App, graphQL} from "../app";
import {routes} from "../routes";
import {Document} from "./template";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const routeMap = routes.reduce(
	(previousValue, {location, name}) => ({...previousValue, [location]: name}),
	{"*": "notFound"}
);

export const renderSSR = async (request: express.Request, response: express.Response) => {
	const isServer = typeof response === "object" && typeof response.send === "function";
	const sheet = new ServerStyleSheet();
	const name = routeMap[request.url] || routeMap["*"];
	const render = (data?) => (
		<StaticRouter location={request.url} context={{}}>
			<App data={data} />
		</StaticRouter>
	);
	toHTML(<StyleSheetManager sheet={sheet.instance}>{render()}</StyleSheetManager>);
	const cache = await graphQL.collect();
	Head.rewind();
	const app = toHTML(render(cache));
	const styles = sheet.getStyleTags();
	const head = Head.renderStatic();
	const html = toHTML5(
		<Document
			head={head}
			app={app}
			isServer={isServer}
			scripts={`<script>window.${INITIAL_STATE_PROP} = ${JSON.stringify({
				[name]: cache[name]
			})}</script>`}
			styles={styles}></Document>
	);
	if (isServer) {
		return response.send(html);
	}
	return html;
};
export const serverRenderer = () => renderSSR;
