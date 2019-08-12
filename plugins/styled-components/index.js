const {ServerStyleSheet, StyleSheetManager} = require("styled-components");
const {createElement} = require("react");
const {renderToStaticMarkup} = require("react-dom/server");

module.exports = async (render, options) => {
	const sheet = new ServerStyleSheet();
	renderToStaticMarkup(
		createElement(StyleSheetManager, {sheet: sheet.instance}, render())
	);
	const styles = sheet.getStyleTags();
	return {styles};
};
