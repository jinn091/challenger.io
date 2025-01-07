import { LinksFunction } from "@remix-run/node";
import { WebHackingMethods } from "~/utils/constant";
import indexLinks from "./index.css?url";
import { Form } from "@remix-run/react";
import { formatHackingMethod } from "~/utils/format";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: indexLinks }
];

export default function GetIndex() {
	return (
		<div className="m-5 overflow-hidden w-full flex gap-4">
			<div className="flex flex-col gap-2 flex-1">
				<div className="flex bg-primary-light dark:bg-primary-dark gap-2 p-4 border-[.01px] dark:border-gray-500 rounded hover:shadow-md hover:shadow-gray-600 cursor-pointer min-w-[100%] justify-between items-center">
					<div className="flex flex-col gap-2">
						<h4 className="text-md sm:text-xl font-bold hover:underline">
							<a href="https://tourism.gov.mm/">Tourism.gov.mm</a>
						</h4>
						<h1 className="text-sm sm:text-md">
							Open Redirect Challenge
						</h1>
						<p className="desc">Do whatever you want</p>
						<div className="flex flex-wrap gap-1 sm:gap-2">
							{Object.keys(WebHackingMethods).map((wb, idx) =>
								idx < 4 ? (
									<small
										key={wb}
										className="bg-purple-900 text-white font-semibold text-xs rounded p-[.5] px-[.5rem]"
									>
										{formatHackingMethod(
											wb as WebHackingMethods
										)}
									</small>
								) : null
							)}
						</div>
					</div>
					<div className="flex flex-col items-start">
						<p className="text-[12px] sm:text-[1rem] whitespace-nowrap">
							Price: 1000 MMK
						</p>
						<span className="chip ended">End</span>
					</div>
				</div>
				<div className="flex bg-primary-light dark:bg-primary-dark gap-2 p-4 border-[.01px] dark:border-gray-500 rounded hover:shadow-md hover:shadow-gray-600 cursor-pointer min-w-[100%] justify-between items-center">
					<div className="flex flex-col gap-2">
						<h4 className="text-md sm:text-xl font-bold hover:underline">
							<a href="https://tourism.gov.mm/">Tourism.gov.mm</a>
						</h4>
						<h1 className="text-sm sm:text-md">
							Open Redirect Challenge
						</h1>
						<p className="desc">Do whatever you want</p>
						<div className="flex flex-wrap gap-1 sm:gap-2">
							{Object.keys(WebHackingMethods).map((wb, idx) =>
								idx < 4 ? (
									<small
										key={wb}
										className="bg-purple-900 text-white font-semibold text-xs rounded p-[.5] px-[.5rem]"
									>
										{formatHackingMethod(
											wb as WebHackingMethods
										)}
									</small>
								) : null
							)}
						</div>
					</div>
					<div className="flex flex-col items-start">
						<p className="text-[12px] sm:text-[1rem] whitespace-nowrap">
							Price: 1000 MMK
						</p>
						<span className="chip ended">End</span>
					</div>
				</div>
				<div className="flex bg-primary-light dark:bg-primary-dark gap-2 p-4 border-[.01px] dark:border-gray-500 rounded hover:shadow-md hover:shadow-gray-600 cursor-pointer min-w-[100%] justify-between items-center">
					<div className="flex flex-col gap-2">
						<h4 className="text-md sm:text-xl font-bold hover:underline">
							<a href="https://tourism.gov.mm/">Tourism.gov.mm</a>
						</h4>
						<h1 className="text-sm sm:text-md">
							Open Redirect Challenge
						</h1>
						<p className="desc">Do whatever you want</p>
						<div className="flex flex-wrap gap-1 sm:gap-2">
							{Object.keys(WebHackingMethods).map((wb, idx) =>
								idx < 4 ? (
									<small
										key={wb}
										className="bg-purple-900 text-white font-semibold text-xs rounded p-[.5] px-[.5rem]"
									>
										{formatHackingMethod(
											wb as WebHackingMethods
										)}
									</small>
								) : null
							)}
						</div>
					</div>
					<div className="flex flex-col items-start">
						<p className="text-[12px] sm:text-[1rem] whitespace-nowrap">
							Price: 1000 MMK
						</p>
						<span className="chip on-going">On going</span>
					</div>
				</div>
			</div>
			<div className="bg-secondary-light dark:bg-secondary-dark gap-2 p-4 border-[.01px] dark:border-gray-500 rounded min-w-[400px] hidden xl:flex">
				<Form>
					<h1>Filter</h1>
				</Form>
			</div>
		</div>
	);
}
