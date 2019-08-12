import {INITIAL_STATE_PROP} from "@ngineer/graphql";
import parseReact from "html-react-parser";
import React from "react";

export const Document = (props: any) => {

	return (
		<html lang={props.lang} className="no-js">
			<head>
				{props.head.title.toComponents()}
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{props.head.meta.toComponents()}
				{props.head.link.toComponents()}
				{props.cache && (
					<script
						dangerouslySetInnerHTML={{
							__html: `window["${INITIAL_STATE_PROP}"] = ${JSON.stringify(props.cache)}`
						}}
					/>
				)}
				{props.scripts && parseReact(props.scripts)}
				{props.styles && parseReact(props.styles)}
			</head>
			<body>
				<div data-app-root="" dangerouslySetInnerHTML={{__html: props.app}} />
				{props.isServer && <script src="/main.js" />}
			</body>
		</html>
	);
};
