const {writeFile} = require("fs");
const path = require("path");
const {v4: uuid} = require("uuid");

const SIMPSONS = ["Homer", "Marge", "Bart", "Lisa", "Maggie"];

const DATA = JSON.stringify(
	{
		items: Array(10)
			.fill(Boolean)
			.map((x, i) => ({
				id: uuid(),
				label: `Item ${i}`
			})),
		entries: [],
		simpsons: SIMPSONS.map(label => ({
			label,
			id: uuid()
		}))
	},
	null,
	2
);

writeFile(path.resolve(__dirname, "db.json"), DATA, "utf-8", err => {
	if (err) {
		console.error(err);
	}
});
