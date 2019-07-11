import {JSDOM} from "jsdom";

declare global {
	namespace NodeJS {
		interface Global {
			document: Document;
			window: Window;
			navigator: Navigator | {userAgent: string};
			requestAnimationFrame: (callback: any) => number;
			cancelAnimationFrame: (id: any) => void;
			CSS: {supports: (property: string, value: string) => boolean};
		}
	}
}

interface DomOptions {
	head?: string;
}

const copyProps = (src: Window, target: NodeJS.Global): void => {
	Object.defineProperties(target, {
		...Object.getOwnPropertyDescriptors(src),
		...Object.getOwnPropertyDescriptors(target)
	});
};

export const initDOM = ({head = ""}: DomOptions = {}) => {
	const jsdom = new JSDOM(
		`<!doctype html><html lang="en"><head><title>Test</title>${head}</head><body></body></html>`
	);
	const {window} = jsdom;

	global.window = window;
	global.document = window.document;
	global.navigator = {
		userAgent: "node.js"
	};
	global.requestAnimationFrame = (callback: any): number => {
		return setTimeout(callback, 0);
	};
	global.cancelAnimationFrame = (id: any): void => {
		clearTimeout(id);
	};
	global.CSS = {
		supports(property: string, value: string): boolean {
			// always supported
			return true;
		}
	};
	copyProps(window, global);
};
