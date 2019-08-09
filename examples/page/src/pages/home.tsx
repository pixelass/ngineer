import {gql} from "@ngineer/graphql";
import {Head} from "@ngineer/head";
import React from "react";
import {Background} from "../elements/background";
import {Card} from "../elements/card";
import {Headline} from "../elements/headline";
import {Wrapper} from "../elements/wrapper";

export const Page = ({name, ...props}) => {
	const {data} = props;
	return (
		<React.Fragment>
			<Head>
				<title>Ngineer</title>
				<meta name="description" content="Welcome to Ngineer. Own the config." />
			</Head>
			<Background />
			<Wrapper>
				<Card>
					<Headline>Hello Ngineer!</Headline>
					<ul>{data && data.items.map(item => <li key={item.id}>{item.label}</li>)}</ul>
				</Card>
			</Wrapper>
		</React.Fragment>
	);
};

export const query = gql`
	{
		items {
			id
			label
		}
	}
`;
