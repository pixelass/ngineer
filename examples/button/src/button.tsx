import React from "react";
import styled from "styled-components";
interface ButtonProps {
	variant?: "primary" | "secondary";
	theme: {};
}
const StyledButton = styled.button<ButtonProps>`
	border: 0;
	font-size: 1em;
	padding: 0.5em 1em;
	height: 2.5em;
	border-radius: 3px;
	margin: 0;
	background: ${props => props.theme[props.variant] || "lightgrey"};
	box-shadow: inset 0 0 0 1px hsla(0, 0%, 0%, 0.3), var(--focus-ring, 0 0 0);
	color: black;
	cursor: pointer;

	&:hover {
		background-image: linear-gradient(
			hsla(0, 0%, 0%, 0.2),
			hsla(0, 0%, 0%, 0.2)
		);
	}
	&:active {
		color: hsla(0, 0%, 0%, 0.5);
	}
	&:focus {
		--focus-ring: 0 0 0 5px highlight;
		outline: 0;
	}
	&[disabled] {
		background-image: linear-gradient(
			hsla(0, 0%, 0%, 0.4),
			hsla(0, 0%, 0%, 0.4)
		);
		color: hsla(0, 0%, 0%, 0.25);
		cursor: default;
	}
`;

export const ButtonRow = styled.div`
	display: grid;
	grid-template-columns: repeat(
		${props => React.Children.count(props.children)},
		max-content
	);
	grid-gap: 1rem;
`;

export const Button = props => <StyledButton {...props} />;
