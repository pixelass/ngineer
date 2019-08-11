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
	prefetch?: boolean;
	children?: (response: any) => React.ReactNode;
	render?: (response: any) => React.ReactNode;
}

export interface QueryState {
	loading?: boolean;
}

export interface GraphQLContext {
	graphQL?: GraphQL;
	prefetch?: boolean;
}

export const {Provider: GraphQLProvider, Consumer: GraphQLConsumer} = React.createContext<
	GraphQLContext
>({});

export interface ProviderProps {
	children?: React.ReactNode | React.ReactNode[];
	graphQL: GraphQL;
	prefetch?: boolean;
}
export const Provider: React.FunctionComponent<ProviderProps> = ({children, graphQL, prefetch}) => (
	<GraphQLProvider value={{graphQL, prefetch}}>
		<ReduxProvider store={store}>{children}</ReduxProvider>
	</GraphQLProvider>
);

export class QueryBase extends React.Component<QueryProps & {graphQL: GraphQL}, QueryState> {
	public state: Readonly<QueryState> = {};
	public constructor(props) {
		super(props);
		if (!this.exists && this.props.prefetch) {
			this.props.graphQL.add(this.props.name, this.props.query);
		}
	}

	public componentDidMount() {
		this.fetch(!this.exists && !this.props.prefetch);
	}

	public componentDidUpdate({query}) {
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
		if (force) {
			this.setState({loading: true}, () => {
				this.props.graphQL
					.get(this.props.query)
					.then(({data}) => {
						this.props.save({[this.props.name]: data});
						this.setState({loading: false});
					})
					.catch(this.props.onError);
			});
		} else if (!this.exists) {
			this.setState({loading: true}, () => {
				this.props.graphQL.read(this.props.name).then(({data}) => {
					this.props.save({[this.props.name]: data});
					this.setState({loading: false});
				});
			});
		}
	};
}

export const QueryImpl = (props: QueryProps) => (
	<GraphQLConsumer>
		{({graphQL, prefetch}) => <QueryBase graphQL={graphQL} prefetch={prefetch} {...props} />}
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
