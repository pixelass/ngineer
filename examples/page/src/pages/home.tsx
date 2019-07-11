import {Head} from "@ngineer/head";
import React from "react";
import {Background} from "../elements/background";
import {Card} from "../elements/card";
import {Headline} from "../elements/headline";
import {Wrapper} from "../elements/wrapper";

export const Home =  () => (
	<React.Fragment>
		<Head>
			<title>Ngineer home</title>
			<meta name="description" content="Welcome to Ngineer"/>
		</Head>
		<Background/>
		<Wrapper>
			<Card>
				<Headline>Hello Ngineer!</Headline>
				<img src="/assets/ngineer.png" alt="ngineer"/>
			</Card>
		</Wrapper>
	</React.Fragment>
);
