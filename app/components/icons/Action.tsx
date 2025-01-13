import React from "react";

export default function ClassIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			enableBackground="new 0 0 48 48"
			id="Layer_3"
			version="1.1"
			viewBox="0 0 48 48"
			xmlSpace="preserve"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			{...props}
		>
			<g>
				<circle cx="5.5" cy="24" r="5.5" />
				<circle cx="42.499" cy="24" r="5.5" />
				<circle cx="24" cy="24" r="5.5" />
			</g>
		</svg>
	);
}
