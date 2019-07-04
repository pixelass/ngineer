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
			rollup: {
				type: "boolean",
				alias: "r"
			},
			watch: {
				type: "boolean",
				alias: "w"
			},
			tsc: {
				type: "boolean",
				alias: "t"
			}
		}
	}
);
