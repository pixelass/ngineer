import styled from "styled-components";

export const Text = styled.p<{size?: "small" | "normal" | "large"}>`
	padding: 1rem 0;
	margin: 0 auto;
	font-weight: normal;
	font-size: ${({size}) => {
		switch (size) {
			case "small":
				return "0.75em";
			case "large":
				return "2em";
			case "normal":
			default:
				return "1em";
		}
	}};
`;
