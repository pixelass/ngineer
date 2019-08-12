import ngineerDefaultConfig from "@ngineer/config";
import {Head} from "@ngineer/head";
import cosmiconfig from "cosmiconfig";
import express from "express";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {StaticRouter} from "react-router";
import {Document} from "./template";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const toHTML = (js: React.ReactElement): string => ReactDOMServer.renderToStaticMarkup(js);
export const toHTML5 = (js: React.ReactElement): string => `<!doctype html>${toHTML(js)}`;

export type Renderer = () => (
	request: express.Request,
	response: express.Response
) => Promise<express.Response | string>;

const explorer = cosmiconfig("ngineer");
const {config: ngineerCustomConfig} = explorer.searchSync();
export const ngineerConfig = {
	...ngineerDefaultConfig,
	...ngineerCustomConfig
};
export const cwd = process.cwd();

export const LIB = path.resolve(cwd, ngineerConfig.lib);
export const APP = path.resolve(LIB, ngineerConfig.app);
export const ROUTES = path.resolve(LIB, ngineerConfig.routes);
// tslint:disable-next-line:no-var-requires
export const {App} = require(APP);
// tslint:disable-next-line:no-var-requires
export const {routes} = require(ROUTES);

function findPlugin(plugin) {
	const corePrefix = "@ngineer/plugin-";
	const thirdPartyPrefix = "ngineer-plugin-";
	const isCore = plugin.match(new RegExp(`^${corePrefix}`));
	const hasPrefix = plugin.match(new RegExp(`^${thirdPartyPrefix}`));
	if (isCore || hasPrefix) {
		return require(plugin);
	}
	let ngineerPlugin;
	try {
		ngineerPlugin = require(`${corePrefix}${plugin}`);
	} catch (notCore) {
		ngineerPlugin = notCore;

		try {
			ngineerPlugin = require(`${thirdPartyPrefix}${plugin}`);
		} catch (notAvailable) {
			ngineerPlugin = notAvailable;
		}
	}
	return ngineerPlugin;
}

const ngineerPlugins = ngineerConfig.plugins.map(pluginOrArr => {
	const [plugin, options] = Array.isArray(pluginOrArr) ? pluginOrArr : [pluginOrArr, {}];
	return {name: plugin, fn: findPlugin(plugin), options};
});

 function collectPluginProps (previousValue, {props}) {
 	return {...previousValue, ...props};
 }

 async function loadPlugin({fn, options, ...rest}, render) {
 	const props = await fn(render, options);
 	return {
 		...rest,
 		props
 	};
 }

 async function loadPlugins(plugins, render) {
	const loadedPlugins = await Promise.all(plugins.map(plugin => loadPlugin(plugin, render)));
	return loadedPlugins.reduce(collectPluginProps, {});
}

const routeMap = routes.reduce(
	(previousValue, {location, name}) => ({...previousValue, [location]: name}),
	{"*": "notFound"}
);


export function serverRenderer() {
	return async function renderWithPlugins(request, response) {
		const isServer = typeof response === "object" && typeof response.send === "function";
		const name = routeMap[request.url] || routeMap["*"];
		const render = (data?) => (
			<StaticRouter location={request.url} context={{}}>
				<App data={data} />
			</StaticRouter>
		);
		const propsFromPlugins = await loadPlugins(ngineerPlugins, render);
		Head.rewind();
		const app = toHTML(render());
		const head = Head.renderStatic();
		const html = toHTML5(
			<Document lang="en" app={app} name={name} head={head}  isServer={isServer} {...propsFromPlugins}/>
		);
		if (isServer) {
			return response.send(html);
		}
		return html;
	};
}
