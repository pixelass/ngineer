import React from "react";
export interface DataEntry {
	[x: string]: any;
}
export type Fetch = (url: string) => Promise<DataModel>;

export interface DataModel {
	isFetching: boolean;
	data: DataEntry | DataEntry[];
	fetch: () => void;
}
export interface ContextModel {
	[x: string]: DataModel;
}
const {Provider, Consumer: Data} = React.createContext({}) as React.Context<ContextModel>;
export {Data};

export class DataFetcher extends React.Component<{url: string; as: string; fetch?: Fetch}> {
	static get defaultProps() {
		return {
			fetch: url => fetch(url).then(res => res.json())
		};
	}
	public state = {};
	public fetch = () => {
		this.setState(prevState => {
			if (prevState[this.props.as]) {
				return {[this.props.as]: {data: prevState[this.props.as].data, isFetching: true}};
			}
			return {[this.props.as]: {data: [], isFetching: true}};
		});
		this.props
			.fetch(this.props.url)
			.then(data => {
				this.setState({[this.props.as]: {data, isFetching: false, fetch: this.fetch}});
			})
			.catch(err => {
				throw err;
			});
	};

	public componentDidMount() {
		this.fetch();
	}
	public componentDidUpdate(oldProps) {
		if (
			this.props.url !== oldProps.url ||
			this.props.fetch !== oldProps.fetch ||
			this.props.as !== oldProps.as
		) {
			this.fetch();
		}
	}
	public render() {
		return (
			<Data>
				{ctx => <Provider value={{...ctx, ...this.state}}>{this.props.children}</Provider>}
			</Data>
		);
	}
}
