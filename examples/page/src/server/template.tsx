import Parser from "html-react-parser";
import React from "react";

export const Document = (props: any) => (
	<html lang={props.lang} className="no-js">
	<head>
		<title>Ngineer</title>
		<meta charSet="utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		{Parser(props.styles)}
		{props.isServer && <link href="/main.css" rel="stylesheet"/>}
	</head>
	<body>
		<div data-app-root="">{Parser(props.app)}</div>
		{props.isServer && <script src="/main.js"/>}
	</body>
	</html>
);
