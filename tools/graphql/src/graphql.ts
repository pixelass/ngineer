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
	private readonly props: GraphQLProps;
	private get root() {
		return this.props.root;
	}
	private get schema() {
		return this.props.schema;
	}
	private cache: Cache = {};
	public constructor(props: GraphQLProps) {
		this.props = props;
	}
	public add = (id: string, query: string): void => {
		this.cache[id] = this.get(query);
	};
	public remove = (id: string): void => {
		delete this.cache[id];
	};
	public read = (id: string): Promise<any> => this.cache[id];
	public get = (query: string): Promise<any> => graphql(this.schema, query, this.root);
	public collect = async (): Promise<Data> => {
		const resolved = await Promise.all(Object.values(this.data));
		return Object.keys(this.data).reduce(
			(previousValue, currentValue, currentIndex) => ({...previousValue, [currentValue]: resolved[currentIndex]}),
			{}
		);;
	};
	get data(): Cache {
		return this.cache;
	}
}
