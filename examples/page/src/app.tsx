import {fetchJSON, GraphQL, Provider, Query} from "@ngineer/graphql";
import {buildSchema} from "graphql";
import React from "react";
import {hot} from "react-hot-loader/root";
import {Route, Switch} from "react-router";
import {ThemeProvider} from "styled-components";
import db from "../db.json";
import {Sidebar} from "./components/sidebar";
import {NotFound} from "./pages";
import {routes} from "./routes";
import GlobalStyle from "./style";
import theme from "./theme";


export const host = "https://localhost:3000/api";
export const root = process.env.NODE_ENV === "production" ?
	{
		entries: () =>  db.entries,
		items: () =>  db.items,
		simpsons: () =>  db.simpsons
	} : {
		entries: () => fetchJSON(`${host}/entries`),
		items: () => fetchJSON(`${host}/items`),
		simpsons: () => fetchJSON(`${host}/simpsons`)
	};

export const schema = buildSchema(`
		type Entry {
			id: String!
			label: String!
		}
		type Item {
			id: String!
			label: String!
		}
		type Simpson {
			id: String!
			label: String!
		}
		type Query {
			entries: [Entry]!
			items: [Item]!
			simpsons: [Simpson]!
		}
	`);

export const graphQL = new GraphQL({
	root,
	schema
});

export interface AppProps {
	data?: any;
}

export const withQuery = ({Page, query, data, name}) =>
	data || !query ? (
		<Page data={data} />
	) : (
		<Query query={query} name={name}>
			{response => <Page {...response} />}
		</Query>
	);

export const AppImpl = ({data = {}}: AppProps) => {
	return (
		<Provider graphQL={graphQL} prefetch>
			<ThemeProvider theme={theme}>
				<React.Fragment>
					<GlobalStyle />
					<Sidebar />
					<Switch>
						{routes.map(({component, location, name}) => (
							<Route
								key={name}
								exact={true}
								path={location}
								render={() => withQuery({name, ...component, ...data[name]})}
							/>
						))}
						<Route
							render={() =>
								withQuery({...NotFound, name: "notFound", data: data.notFound})
							}
						/>
					</Switch>
				</React.Fragment>
			</ThemeProvider>
		</Provider>
	);
};

AppImpl.defaultPops = {
	data: {}
};

export const App = hot(AppImpl);
