const {GraphQL} = require("@ngineer/graphql");
const {renderToStaticMarkup} = require("react-dom/server");
module.exports = async (render, options) => {
	renderToStaticMarkup(render());
	const cache = await GraphQL.collect();
	return {app: renderToStaticMarkup(render(cache)), cache};
};
