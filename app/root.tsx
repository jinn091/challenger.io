import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useNavigate,
	useRouteError
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import globalStyle from "./global.css?url";
import React from "react";

export const links: LinksFunction = () => [
	{
		rel: "stylesheet",
		href: globalStyle
	}
];

export function ErrorBoundary(): React.JSX.Element {
	const error = useRouteError();
	const navigate = useNavigate();
	let status = 500;
	let errorMessage = "Internal Server Error";
	if (isRouteErrorResponse(error)) {
		status = error.status;
		if (error.status == 404) {
			errorMessage = "Not Found";
		}
	}

	return (
		<Document>
			<main className="h-screen flex flex-col justify-center items-center bg-gray-900">
				<div className="flex items-center gap-[1.5rem]">
					<h1 className="text-4xl text-gray-300">{status}</h1>
					<div className="h-[50px] bg-white w-[1px]"></div>
					<div className="flex flex-col">
						<h3 className="text-xl text-gray-300">
							{errorMessage}
						</h3>
						<button
							className="text-white underline"
							onClick={() => navigate(-1)}
						>
							<span className="text-md">Go Back</span>
						</button>
					</div>
				</div>
			</main>
		</Document>
	);
}

export default function App() {
	return (
		<Document>
			<Outlet />
		</Document>
	);
}

function Document({
	children
}: {
	children: React.JSX.Element;
}): React.JSX.Element {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Links />
				<Meta />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
