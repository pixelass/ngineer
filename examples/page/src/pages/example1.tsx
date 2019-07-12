import {Button} from "@examples/button";
import { Head } from "@ngineer/head";
import React from "react";
import styled from "styled-components";
import {v4 as uuid} from "uuid";
import {Card} from "../elements/card";
import {Headline} from "../elements/headline";
import {Spinner} from "../elements/spinner";
import {Wrapper} from "../elements/wrapper";
import {Data, DataFetcher} from "../services/data-fetcher";

const delayedFetcher = (delay: number = 500) => (url: string, options): Promise<any> =>
	fetch(url, options).then(
		res =>
			new Promise(resolve => {
				setTimeout(() => {
					resolve(res.json());
				}, delay);
			})
	);
export interface PostData {
	[key: string]: string | number | boolean | null;
}
const postData = (url: string, options) =>
	fetch(url, {
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		mode: "cors",
		redirect: "follow",
		referrer: "no-referrer",
		...options
	}).then(response => response.json());

const StyledSpinner = styled(Spinner)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: white;
`;

const StyledButton = styled(Button)`
	position: relative;
`;

const LoadingButton = ({children, isLoading, ...props}) => (
	<StyledButton {...props}>
		{isLoading && <StyledSpinner />}
		{children}
	</StyledButton>
);

const FetchButton = ({asProp}) => {
	const label = `Fetch ${asProp}`;
	return (
	<Data>
		{({[asProp]: items}) => (
			<LoadingButton
				onClick={items && items.fetch}
				disabled={!items || items.isFetching}
				isLoading={items && items.isFetching}>
				{label}
			</LoadingButton>
		)}
	</Data>
)};

const postDummy = (name, fetchJson) => async () => {
	const id = `${uuid()}`;
	await postData(`/api/${name}`, {body: JSON.stringify({id, label: Math.ceil(Math.random() * 1000)})});
	fetchJson();
};

const AddButton = ({asProp}) => {
	const label = `Add ${asProp}`;
	return (
		<Data>
			{({[asProp]: items}) => (
				<LoadingButton
					onClick={postDummy(asProp, items.fetch)}
					disabled={!items || items.isFetching}
					isLoading={items && items.isFetching}>
					{label}
				</LoadingButton>
			)}
		</Data>
	);
};

const Logger = () => (
	<Data>
		{ctx =>
			Object.keys(ctx).map(key => (
				<Card key={key}>
					{key === "entries" ? <AddButton asProp={key} /> : <FetchButton asProp={key} />}
					<Headline as="h3">
						{key}{ctx[key].isFetching && <React.Fragment> <Spinner style={{fontSize: "0.8em"}} /></React.Fragment>}
					</Headline>
					<pre>
						<code>{JSON.stringify(ctx[key], null, 4)}</code>
					</pre>
				</Card>
			))
		}
	</Data>
);

const Child = () => (
	<DataFetcher url="/api/items" as="items" fetch={delayedFetcher(500)}>
		<Logger />
	</DataFetcher>
);

export const Example1 = () => (
	<React.Fragment>
		<Head>
			<title>Ngineer examples</title>
			<meta name="description" content="API Mocks made easy"/>
		</Head>
		<Wrapper>
			<DataFetcher url="/api/entries" as="entries">
				<DataFetcher url="/api/simpsons" as="simpsons" fetch={delayedFetcher(5000)}>
					<Child />
				</DataFetcher>
			</DataFetcher>
		</Wrapper>
	</React.Fragment>
);
