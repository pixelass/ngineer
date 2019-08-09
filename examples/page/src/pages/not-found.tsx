import {Head} from "@ngineer/head";
import React from "react";
import {Background} from "../elements/background";
import {Card} from "../elements/card";
import {Headline} from "../elements/headline";
import {Wrapper} from "../elements/wrapper";

export const Page = (props) => (
	<React.Fragment>
		<Head>
			<title>Page not found</title>
			<meta name="description" content="Sorry, this page does not exist."/>
		</Head>
		<Background/>
		<Wrapper>
			<Card>
				<Headline>404</Headline>
			</Card>
		</Wrapper>
	</React.Fragment>
);

export const query = "";
