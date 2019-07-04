const meow = require("meow");
const run = require("./index");

const {
	input: [dirname],
	flags
} = meow(
	`
	Usage
	  $ create-ngineer-app <input>

	Options
	  --name,        -n  package name
	  --description, -d  package description
	  --typescript,  -t  use typescript

	Examples
	  $ create-ngineer-app my-app --typescript
`,
	{
		flags: {
			name: {
				type: "string",
				alias: "n"
			},
			description: {
				type: "string",
				alias: "d"
			},
			typescript: {
				type: "boolean",
				alias: "t"
			}
		}
	}
);
const DEFAULT_DESCRIPTION = "Created with create-ngineer-app";
const {name = dirname, description = DEFAULT_DESCRIPTION, typescript} = flags;

run({dirname, pkg: {name, description}, config: {typescript}});
