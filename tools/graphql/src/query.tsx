import React from "react";
import {connect, Provider as ReduxProvider} from "react-redux";
import {GraphQL} from "./graphql";
import {store} from "./store";
import {save} from "./store/cache";

export const INITIAL_STATE_PROP = "__NGINEER_INITIAL_STATE__";

export const normalize = (str: string): string => str.replace(/\s+/g, " ");

export type Gql = (strings: TemplateStringsArray, ...computations: any[]) => string;

export const gql: Gql = (strings, ...computations) =>
	normalize(
		strings
			.reduce(
				(previousValue, currentValue, currentIndex) => [
					...previousValue,
					currentValue,
					computations[currentIndex]
				],
				[]
			)
			.join("")
	);

export interface QueryProps {
	query: string;
	name: string;
	onError: (error: Error) => void;
	save: (data: {[key: string]: {[key: string]: any}}) => void;
	cache?: {
		data?: any;
	};
	children?: (response: any) => React.ReactNode;
	render?: (response: any) => React.ReactNode;
}

export interface QueryState {
	loading?: boolean;
}

export const {Provider: GraphQLProvider, Consumer: GraphQLConsumer} = React.createContext({});

export const Provider = ({graphql, children}) => (
	<GraphQLProvider value={graphql}>
		<ReduxProvider store={store}>{children}</ReduxProvider>
	</GraphQLProvider>
);

export class QueryBase extends React.Component<QueryProps & {graphQL: GraphQL}, QueryState> {
	public state: Readonly<QueryState> = {};
	public constructor(props) {
		super(props);
		if (!this.exists) {
			this.props.graphQL.add(this.props.name, this.props.query);
		}
	}

	public componentDidMount() {
		this.fetch();
	}

	public componentDidUpdate({query}, prevState) {
		if (query !== this.props.query) {
			this.fetch(true);
		}
	}

	public render() {
		const {children, render = children} = this.props;
		const type = typeof render;
		if (type === "function") {
			return render({loading: this.state.loading, data: this.props.cache[this.props.name]});
		}
		throw new TypeError(`render or children has to be a function. Instead received ${type}`);
	}

	private get exists() {
		return !!this.props.cache[this.props.name];
	}

	private fetch = (force?) => {
		this.setState({loading: true}, () => {
			if (!this.exists || force) {
				this.props.graphQL
					.get(this.props.query)
					.then(({data}) => {
						this.props.save({[this.props.name]: data});
						this.setState({loading: false});
					})
					.catch(this.props.onError);
			}
		});
	};
}

export const QueryImpl = (props: QueryProps) => (
	<GraphQLConsumer>
		{(graphQL: GraphQL) => <QueryBase graphQL={graphQL} {...props} />}
	</GraphQLConsumer>
);

export const Query = connect(
	state => {
		return state;
	},
	{
		save,
		onError(error) {
			// tslint:disable-next-line:no-console
			console.error(error);
		}
	}
)(QueryImpl);
