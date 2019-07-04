import React, {useState} from "react";
import {Link} from "react-router-dom";
import styled, {css} from "styled-components";

interface PanelProps {
	isOpen?: boolean;
}

const Panel = styled.div<PanelProps>`
	--speed: 250ms;
	position: fixed;
	z-index: 1;
	top: 0;
	left: 0;
	height: 100vh;
	background: white;
	color: black;
	flex-grow: 0;
	flex-shrink: 0;
	width: 18rem;
	overflow: hidden;
	transform-origin: 0 50%;
	${({isOpen}) => css`
		transform: ${isOpen ? "translate3d(0,0,0)" : "translate3d(-100%,0,0)"};
		visibility: ${isOpen ? "visible" : "hidden"};
	`};
	
	@media (min-width: 78rem) {
		position: sticky;
		transform: none;
		visibility: visible;
	}
`;

const Nav = styled.nav`
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	margin-top: 4rem;
`;

const StyledLink = styled(Link)`
	color: black;
	padding: 0.5rem 1rem;
	display: block;
	text-decoration: none;
	&:hover {
		background-color: hsla(0, 0%, 0%, 0.1);
	}
`;

const Toggle = styled.button`
	position: fixed;
	z-index: 2;
	top: 0;
	left: 0;
	border: 0;
	margin: 0.25rem;
	height: 3.5rem;
	width: 3.5rem;
	padding: 0;
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: center;
	background-color: hsla(0, 0%, 0%, 0.25);
	color: white;
	@media (min-width: 78rem) {
		display: none;
	}
`;

const icons = {
	menu: "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z",
	menuOpen:
		"M21,15.61L19.59,17L14.58,12L19.59,7L21,8.39L17.44,12L21,15.61M3,6H16V8H3V6M3,13V11H13V13H3M3,18V16H16V18H3Z"
};

interface IconProps {
	size?: number;
	icon: string;
}
const Icon = styled.svg.attrs((props: IconProps) => ({
	children: <path fill="currentColor" d={props.icon} />,
	viewPort: `0 0 ${props.size} ${props.size}`
}))<IconProps>`
	font-size: ${props => `${props.size}px`};
	height: 1em;
	width: 1em;
`;

Icon.defaultProps = {
	size: 24
};

export const Sidebar = props => {
	const [isOpen, setOpen] = useState(false);
	return (
		<React.Fragment>
			<Toggle onClick={() => setOpen(!isOpen)}>
				<Icon icon={icons[isOpen ? "menuOpen" : "menu"]} />
			</Toggle>
			<Panel isOpen={isOpen}>
				<Nav>
					<StyledLink to="/">Home</StyledLink>
					<StyledLink to="/example1">Example 1</StyledLink>
				</Nav>
			</Panel>
		</React.Fragment>
	);
};
