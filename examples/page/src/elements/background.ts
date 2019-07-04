import styled, {css} from "styled-components";
export interface BackgroundProps {
	absolute?: boolean;
	colorRange?: number;
	rotation?: number;
	start?: number;
	steps?: number;
}
export const Background = styled.span<BackgroundProps>`
	--s: 100%;
	--l: 50%;
	--a: 0.2;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	color: black;
	${({absolute, colorRange, rotation, start, steps}) => {
		const range = Array(steps).fill(Boolean);
		return css`
			position: ${absolute ? "absolute" : "fixed"};
			background-color: ${css`hsl(${start}, var(--s), var(--l));`};
			background-image: ${css`
				${range
					.map(
						(x, i) =>
							`linear-gradient(${(rotation / steps) * i}deg, hsla(${(colorRange /
								steps) *
								i}, var(--s), var(--l), var(--a)), transparent 55%)`
					)
					.join(",")}
			`};
		`;
	}}
`;

Background.defaultProps = {
	colorRange: 360,
	rotation: 360,
	start: 0,
	steps: 12
};
