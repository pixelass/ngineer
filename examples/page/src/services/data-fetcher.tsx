import React from "react";
export interface DataEntry {
	[x: string]: any;
}

export type Fetch = (
	url: string,
	options: {
		signal: any;
	}
) => void;

export type FetchData = (
	url: string,
	options: {
		signal: any;
	}
) => Promise<{[k: string]: any}>;

export interface DataModel {
	isFetching: boolean;
	data: DataEntry | DataEntry[];
	fetch: Fetch;
}
export interface ContextModel {
	[x: string]: DataModel;
}
const {Provider, Consumer: Data} = React.createContext({}) as React.Context<ContextModel>;
export {Data};

export class DataFetcher extends React.Component<{url: string; as: string; fetch?: FetchData}> {
	static get defaultProps() {
		return {
			fetch: (url, options) => fetch(url, options).then(res => res.json())
		};
	}

	public state: ContextModel = {
		[this.props.as]: {
			data: [],
			fetch: this.fetch,
			isFetching: false
		}
	};

	private controller: AbortController;

	private signal: AbortSignal;

	public componentDidMount(): void {
		this.controller = new AbortController();
		this.signal = this.controller.signal;
		this.fetch();
	}

	public componentWillUnmount(): void {
		this.controller.abort();
	}

	public componentDidUpdate(oldProps): void {
		if (
			this.props.url !== oldProps.url ||
			this.props.fetch !== oldProps.fetch ||
			this.props.as !== oldProps.as
		) {
			this.fetch();
		}
	}
	public render(): React.ReactNode {
		return (
			<Data>
				{ctx => <Provider value={{...ctx, ...this.state}}>{this.props.children}</Provider>}
			</Data>
		);
	}

	private update = (prevState, nextState): ContextModel => ({
		[this.props.as]: {
			...prevState[this.props.as],
			...nextState
		}
	});

	private fetch = (): void => {
		this.setState(
			prevState => this.update(prevState, {isFetching: true}),
			() => {
				this.props
					.fetch(this.props.url, {signal: this.signal})
					.then(data => {
						this.setState(prevState =>
							this.update(prevState, {data, isFetching: false})
						);
					})
					.catch(err => {
						if (err.name !== "AbortError") {
							throw err;
						}
					});
			}
		);
	};

}
