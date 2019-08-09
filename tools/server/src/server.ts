import ngineerDefaultConfig from "@ngineer/config";
import bodyParser from "body-parser";
import cosmiconfig from "cosmiconfig";
import express from "express";
import https from "https";
import path from "path";
import pem from "pem";
import {Renderer, serverRenderer} from "./renderer";

export interface Certificate {
	serviceKey: string;
	certificate: string;
}
const createCertificate = (): Promise<Certificate> =>
	new Promise((resolve, reject) =>
		pem.createCertificate({days: 365, selfSigned: true}, (err, keys) =>
			err ? reject(err) : resolve(keys)
		)
	);

/**
 * @typedef {function} SetHeaders
 * @param {any} res
 * @param {string} path
 * @param {any} stat
 * @returns {void}
 */
export type SetHeaders = (res: any, path: string, stat: any) => void;

export interface StaticDir {
	dir: string;
	options?: {
		dotfiles?: "ignore";
		etag?: boolean;
		extensions?: string[];
		index?: boolean;
		maxAge?: string;
		redirect?: boolean;
		setHeaders?: SetHeaders;
	};
}
/**
 * @typedef {object} ServerDefaults
 * @property {number} port
 * @property {object} static
 * @property {string} static.dir
 * @property {object} static.options?
 * @property {"ignore"} static.options.dotfiles?
 * @property {boolean} static.options.etag?
 * @property {string[]} static.options.extensions?
 * @property {boolean} static.options.index?
 * @property {string} static.options.maxAge?
 * @property {boolean} static.options.redirect?
 * @property {SetHeaders} static.options.setHeaders?
 */
export interface ServerDefaults {
	port: number;
	renderer: Renderer;
	public: StaticDir;
}
/**
 * @typedef {Partial<ServerDefaults>} ServerConfig
 * @extends ServerDefaults
 */
export type ServerConfig = Partial<ServerDefaults>;

const explorer = cosmiconfig("ngineer");
const {config: ngineerCustomConfig} = explorer.searchSync();
const ngineer = {
	...ngineerDefaultConfig,
	...ngineerCustomConfig
};

/**
 * Creates an express https server.
 *
 * * Serves static files.
 * * Renders Pug templates
 * * Uses sessions
 * * Uses body-parser (json)
 *
 */
export class Server {
	/**
	 * @type {express}
	 */
	public app: express.Application = express();

	/**
	 * @returns {number}
	 */
	public get port(): number {
		return this.app.get("port");
	}

	/**
	 * @type {ServerDefaults}
	 */
	public defaultConfig: ServerDefaults = {
		port: 8080,
		public: {
			dir: path.resolve(process.cwd(), ngineer.public)
		},
		renderer: serverRenderer
	};

	/**
	 * @type {ServerDefaults}
	 */
	public config: ServerDefaults = this.defaultConfig;

	/**
	 * @param {ServerConfig} config
	 */
	public constructor(config: ServerConfig) {
		this.config = {
			...this.defaultConfig,
			...config
		};
		this.app.set("port", this.config.port);

		// Static files
		this.app.use(express.static(this.config.public.dir, this.config.public.options));

		// Body parser
		this.app.use(this.config.renderer());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({extended: true}));

		// Proxy
		this.app.set("trust proxy", 1);
	}

	/**
	 * Start the server
	 */
	public start(): Promise<number> {
		return this.listen(this.port);
	}

	/**
	 * Creates an https server on a specified port
	 * @param {number} port
	 * @returns {Promise<number>}
	 */
	private async listen(port: number): Promise<number> {
		const keys = await createCertificate();
		return new Promise(resolve => {
			https
				.createServer({key: keys.serviceKey, cert: keys.certificate, ca: keys.certificate}, this.app)
				.listen(port, () => {
					resolve(port);
				});
		});
	}
}
