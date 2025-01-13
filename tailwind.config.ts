import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			backgroundColor: {
				"primary-light": "white",
				"primary-dark": "#161616",
				"secondary-light": "#e6e3e3",
				"secondary-dark": "#222222"
			}
		}
	},
	darkMode: "class",
	plugins: []
} satisfies Config;
