import {test, withPage} from "@ngineer/testing-utils";

const url = "http://localhost:5000";

test('page title should contain "Ngineer"', withPage, async (t, page) => {
	await page.goto(url);
	const title = await page.title();
	t.true(title.includes("Ngineer"));
});
