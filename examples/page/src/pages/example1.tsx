import {Button} from "@examples/button";
import React from "react";
import styled from "styled-components";
import {v4 as uuid} from "uuid";
import {Card} from "../elements/card";
import {Headline} from "../elements/headline";
import {Spinner} from "../elements/spinner";
import {Wrapper} from "../elements/wrapper";
import {Data, DataFetcher} from "../services/data-fetcher";

const delayedFetcher = (delay: number = 500) => (url: string): Promise<any> =>
	fetch(url).then(
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
const postData = (url: string, data: PostData = {}) =>
	fetch(url, {
		body: JSON.stringify(data),
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		mode: "cors",
		redirect: "follow",
		referrer: "no-referrer"
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

const FetchButton = ({name}) => (
	<Data>
		{({[name]: items}) => (
			<LoadingButton
				onClick={items && items.fetch}
				disabled={!items || items.isFetching}
				isLoading={items && items.isFetching}>
				Fetch {name}
			</LoadingButton>
		)}
	</Data>
);

const postDummy = (name, fetchJson) => async () => {
	const id = `${uuid()}`;
	await postData(`/api/${name}`, {id, label: Math.ceil(Math.random() * 1000)});
	fetchJson();
};

const AddButton = ({name}) => {
	return (
		<Data>
			{({[name]: items}) => (
				<LoadingButton
					onClick={postDummy(name, items ? items.fetch : () => undefined)}
					disabled={!items || items.isFetching}
					isLoading={items && items.isFetching}>
					Add {name}
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
					{key === "entries" ? <AddButton name={key} /> : <FetchButton name={key} />}
					<Headline as="h3">
						{key} {ctx[key].isFetching && <Spinner style={{fontSize: "0.8em"}} />}
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
		<Wrapper>
			<DataFetcher url="/api/entries" as="entries">
				<DataFetcher url="/api/simpsons" as="simpsons" fetch={delayedFetcher(5000)}>
					<Card>
						<Headline>API mocks.</Headline>
						<Child />
					</Card>
				</DataFetcher>
			</DataFetcher>
		</Wrapper>
	</React.Fragment>
);
