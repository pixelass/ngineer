import fetchPonyfill from "fetch-ponyfill";

export const {fetch} = fetchPonyfill();

export const fetchJSON = (url, options?): Promise<any> => fetch(url, options).then(r => r.json());
