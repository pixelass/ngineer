import React from "react";
import styled, {keyframes} from "styled-components";

const spin = keyframes`
	from {
		stroke-dashoffset: 31.5;
	}
	to {
		stroke-dashoffset: -31.5;
	}
`;
const Circle = styled.path.attrs({
	d: "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
})`
	stroke: currentColor;
	stroke-width: 2;
	stroke-dasharray: 31.5;
	fill: none;
	animation: ${spin} 0.5s linear infinite;
`;

export const Spinner = styled.svg.attrs({
	children: React.createElement(Circle),
	viewBox: "0 0 24 24"
})`
	font-size: 24px;
	height: 1em;
	width: 1em;
`;
