import React from "react";

import {renderToStaticMarkup} from "react-dom/server";

const reduceMeta = (collection, entry) => {
	const {charSet, name, property} = entry;
	const isCharset = charSet && collection.find(x => x.charSet);
	const sameName = name && collection.find(x => x.name === name);
	const sameProperty = property && collection.find(x => x.property === property);
	if (sameName) {
		const index = collection.indexOf(sameName);
		collection.splice(index, 1, entry);
	} else if (sameProperty) {
		const index = collection.indexOf(sameProperty);
		collection.splice(index, 1, entry);
	} else if (isCharset) {
		const index = collection.indexOf(isCharset);
		collection.splice(index, 1, entry);
	} else {
		collection.push(entry);
	}
	return collection;
};

const reduceLink = (collection, entry) => {
	const isCanonical = entry.rel === "canonical" && collection.find(x => x.rel === "canonical");
	const isSame = collection.find(x => JSON.stringify(x) === JSON.stringify(entry));
	if (isCanonical) {
		const index = collection.indexOf(isCanonical);
		collection.splice(index, 1, entry);
	} else if (isSame) {
		const index = collection.indexOf(isSame);
		collection.splice(index, 1, entry);
	} else {
		collection.push(entry);
	}
	return collection;
};

const updateMeta = (meta: Attributes): void => {
	const {name, property, charSet} = meta;
	const x = name || property;
	const p = name ? "name" : property ? "property" : charSet ? "charset" : null;
	if (p) {
		const xx = charSet
			? document.querySelector(`meta[charset]`)
			: document.querySelector(`meta[${p}="${x}"]`);
		const xxx = !xx && document.createElement("meta");
		Object.entries(meta).forEach(([k, v]: [string, string]) => {
			if (xx) {
				xx.setAttribute(k, v);
			} else {
				xxx.setAttribute(k, v);
				document.head.appendChild(xxx);
			}
		});
	}
};

const updateLink = (link: Attributes): void => {
	const {rel} = link;
	const p = rel === "canonical" ? "canonical" : null;
	const xx = p && document.querySelector(`link[rel="canonical"]`);
	const yy = document.querySelector(
		`link${Object.entries(link)
			.map(([k, v]) => `[${k}="${v}"]`)
			.join("")}`
	);
	const xxx = yy || xx || document.createElement("link");
	Object.entries(link).forEach(([k, v]: [string, string]) => {
		if (xx) {
			xx.setAttribute(k, v);
		} else if (!yy) {
			xxx.setAttribute(k, v);
			document.head.appendChild(xxx);
		}
	});
};

export interface Attributes {
	[k: string]: string;
}
export interface Values {
	link: Attributes[];
	meta: Attributes[];
	title: React.ReactElement;
}

const INITIAL_VALUES: Values = {
	link: [],
	meta: [],
	title: null
};

export class Head extends React.Component {
	public static rewind() {
		Head.tags = INITIAL_VALUES;
	}
	public static renderStatic() {
		const {meta, link, title} = Head.tags;
		const metaComponents = (
			<React.Fragment>
				{meta.map((props, i) => (
					<meta {...props} key={i} />
				))}
			</React.Fragment>
		);
		const linkComponents = (
			<React.Fragment>
				{link.map((props, i) => (
					<link {...props} key={i} />
				))}
			</React.Fragment>
		);
		return {
			link: {
				toComponents: () => linkComponents,
				toString: () => renderToStaticMarkup(linkComponents)
			},
			meta: {
				toComponents: () => metaComponents,
				toString: () => renderToStaticMarkup(metaComponents)
			},
			title: {
				toComponents: () => title,
				toString: () => renderToStaticMarkup(title)
			}
		};
	}

	private static tags: Values = INITIAL_VALUES;

	private title = React.Children.toArray(this.props.children).find(
		(x: React.ReactChild) => typeof x === "object" && x.type === "title"
	);

	private meta = React.Children.toArray(this.props.children).filter(
		(x: React.ReactChild) => typeof x === "object" && x.type === "meta"
	);

	private link = React.Children.toArray(this.props.children).filter(
		(x: React.ReactChild) => typeof x === "object" && x.type === "link"
	);

	public constructor(props) {
		super(props);
		this.init();
	}

	public componentDidMount(): void {
		Head.tags.meta.forEach(updateMeta);
		Head.tags.link.forEach(updateLink);
		document.title = Head.tags.title.props.children;
	}

	public render() {
		return null;
	}

	private init = () => {
		Head.tags.title = this.title as React.ReactElement;
		Head.tags.meta = [
			...Head.tags.meta,
			...this.meta.map(({props: metaProps}: React.ReactComponentElement<any>) => metaProps)
		].reduce(reduceMeta, []);
		Head.tags.link = [
			...(Head.tags.link || []),
			...this.link.map(({props: linkProps}: React.ReactComponentElement<any>) => linkProps)
		].reduce(reduceLink, []);
	};
}
