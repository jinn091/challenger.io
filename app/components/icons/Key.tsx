import React from "react";

export default function Key(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 256 256"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect fill="none" height="256" width="256" />
			<circle
				cx="128"
				cy="140"
				fill="none"
				r="20"
				stroke="#000"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
			/>
			<line
				fill="none"
				stroke="#000"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
				x1="128"
				x2="128"
				y1="160"
				y2="184"
			/>
			<rect
				fill="none"
				height="128"
				rx="8"
				stroke="#000"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
				width="176"
				x="40"
				y="88"
			/>
			<path
				d="M92,88V52a36,36,0,0,1,72,0"
				fill="none"
				stroke="#000"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
			/>
		</svg>
	);
}
