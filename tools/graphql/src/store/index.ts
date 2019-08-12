import {combineReducers, createStore} from "redux";
import {reducer as cache} from "./cache";

export const store = createStore(combineReducers({cache}));
