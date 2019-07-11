import { Head } from "@ngineer/head";
import React from "react";
import {Headline} from "../elements/headline";
import {Wrapper} from "../elements/wrapper";

export const NotFound = () => (
	<Wrapper>
		<Head>
			<title>Ngineer 404</title>
			<meta name="description" content="Page not found"/>
		</Head>
		<Headline>404</Headline>
	</Wrapper>
);
