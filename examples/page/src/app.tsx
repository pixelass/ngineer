import React from "react";
import {hot} from "react-hot-loader/root";
import {Route, Switch} from "react-router";
import {ThemeProvider} from "styled-components";
import {Sidebar} from "./components/sidebar";
import {NotFound} from "./pages";
import {routes} from "./routes";
import GlobalStyle from "./style";
import theme from "./theme";

const App = () => (
	<ThemeProvider theme={theme}>
		<React.Fragment>
			<GlobalStyle />
			<Sidebar />
			<Switch>
				{routes.map(({component, location}) => (
					<Route key={location} exact={true} path={location} component={component} />
				))}
				<Route component={NotFound} />
			</Switch>
		</React.Fragment>
	</ThemeProvider>
);
export default hot(App);
