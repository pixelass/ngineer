import {gql} from "@ngineer/graphql";
import {Head} from "@ngineer/head";
import React from "react";
import {Spinner} from "../elements/spinner";
import {Wrapper} from "../elements/wrapper";

export const Page = ({loading, data}) => (
	<React.Fragment>
		<Head>
			<title>A simple example</title>
			<meta name="description" content="Just a simple example page. This page uses graphql with SSR." />
		</Head>
		<Wrapper>
			{loading && <Spinner/>}
			<ul>{data && data.simpsons.map(({label, id}) => <li key={id}>{label}</li>)}</ul>
		</Wrapper>
	</React.Fragment>
);

export const query = gql`
	{
		simpsons {
			label
			id
		}
	}
`;
