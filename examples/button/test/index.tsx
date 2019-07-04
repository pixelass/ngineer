import {test, renderJSX} from "@ngineer/testing-utils";
import React from "react";
import {Button} from "../src";

test("Button component renders correctly", t => {
	t.snapshot(renderJSX.create(<Button />).toJSON());
});
