import React from "react";
import { Example1, Home, NotFound } from "./pages";

export interface Route {
	component: React.ComponentType<any>;
	location: string;
}

export type Routes = Route[];

export const routes = [
	{
		component: Home,
		location: "/"
	},
	{
		component: Example1,
		location: "/example1"
	},
	{
		component: NotFound,
		location: "/404"
	}
] as Routes;
