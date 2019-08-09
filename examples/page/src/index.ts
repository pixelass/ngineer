import {INITIAL_STATE_PROP} from "@ngineer/graphql";
import {createElement} from "react";
import {hydrate} from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {App} from "./app";

const appRoot = document.querySelector("[data-app-root]");
const {classList} = document.documentElement;
classList.remove("no-js");
classList.add("js");

const data = window[INITIAL_STATE_PROP];
delete window[INITIAL_STATE_PROP];
hydrate(createElement(BrowserRouter, null, createElement(App, {data})), appRoot);
