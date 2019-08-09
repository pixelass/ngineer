import React from "react";
import { Example, Home, NotFound } from "./pages";

export interface Route {
	component: {
		Page: React.ComponentType<any>;
		query: string;
	};
	location: string;
	name: string;
}

export type Routes = Route[];

export const routes = [
	{
		component: Home,
		location: "/",
		name: "home"
	},
	{
		component: Example,
		location: "/example",
		name: "example"
	},
	{
		component: NotFound,
		location: "/404",
		name: "notFound"
	}
] as Routes;
