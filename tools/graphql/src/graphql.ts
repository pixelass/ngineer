import {graphql, GraphQLSchema} from "graphql";

export interface Root {
	[key: string]: (url: string) => any;
}

export interface GraphQLProps {
	schema: GraphQLSchema;
	root: Root;
}

export interface Data {
	[key: string]: any;
}

export interface PageData {
	data: Data;
}

export interface Cache {
	[key: string]: Promise<PageData>;
}

export class GraphQL {
	public static collect = async (): Promise<Data> => {
		const resolved = await Promise.all(Object.values(GraphQL.data));
		return Object.keys(GraphQL.data).reduce(
			(previousValue, currentValue, currentIndex) => ({...previousValue, [currentValue]: resolved[currentIndex]}),
			{}
		);
	};
	private static get data(): Cache {
		return GraphQL.cache;
	}
	private static cache: Cache = {};
	private readonly props: GraphQLProps;
	private get root() {
		return this.props.root;
	}
	private get schema() {
		return this.props.schema;
	}
	public constructor(props: GraphQLProps) {
		this.props = props;
	}
	public add = (id: string, query: string): void => {
		GraphQL.cache[id] = this.get(query);
	};
	public remove = (id: string): void => {
		delete GraphQL.cache[id];
	};
	public read = (id: string): Promise<any> => GraphQL.cache[id];

	public get = (query: string): Promise<any> => graphql(this.schema, query, this.root);
}
