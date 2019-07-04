import {createGlobalStyle} from "styled-components";

export default createGlobalStyle`
	body {
		margin: 0;
		font-family:
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			Roboto,
			Oxygen-Sans,
			Ubuntu,
			Cantarell,
			"Helvetica Neue",
			sans-serif;
		overflow-x: hidden;
		min-width: 20rem;
	}
	*, *::before, *::after {
		box-sizing: border-box;
	}
	[data-app-root] {
		min-height: 100vh;
		background: black;
		color: white;
		display: flex;
	}
`;
