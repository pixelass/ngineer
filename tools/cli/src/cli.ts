import meow from "meow";

export const {
	input: [cmd, ...input],
	flags
} = meow(
	`
	Usage
	  $ ngineer <input> [...flags]

	Options
	  --prod,   -p   enable production mode
	  --fix,    -f   fix linting errors
	  --tsc,    -t   pack with tsc
	  --rollup, -r   pack with rollup.js
	  --watch,  -w   watch files
	  --update, -u   update snapshots

	Examples
	  $ ngineer -rw
`,
	{
		flags: {
			fix: {
				alias: "f",
				type: "boolean"
			},
			prod: {
				alias: "p",
				type: "boolean"
			},
			rollup: {
				alias: "r",
				type: "boolean"
			},
			tsc: {
				alias: "t",
				type: "boolean"
			},
			update: {
				alias: "u",
				type: "boolean"
			},
			watch: {
				alias: "w",
				type: "boolean"
			}
		}
	}
);
