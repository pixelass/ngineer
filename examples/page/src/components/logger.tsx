import React from "react";

export const Logger = props => (
	<pre>
		<code>{JSON.stringify(props, null, 4)}</code>
	</pre>
);
