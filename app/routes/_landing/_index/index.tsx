import { json, LinksFunction, TypedResponse } from "@remix-run/node";
import { WebHackingMethods } from "~/utils/constant";
import indexLinks from "./index.css?url";
import { Form, useLoaderData } from "@remix-run/react";
import {
	formatHackingMethod,
	formatChallengeStatusToString
} from "~/utils/format";
import { getChallenges } from "~/model/challenge.server";
import { Challenge } from "@prisma/client";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: indexLinks }
];

export async function loader(): Promise<TypedResponse<Challenge[]>> {
	const challenges = await getChallenges({});

	return json(challenges);
}

export default function GetIndex() {
	const challenges = useLoaderData<typeof loader>();

	return (
		<div className="m-5 overflow-hidden w-full flex gap-4">
			<div className="flex flex-col gap-2 flex-1">
				{challenges.map(
					({
						id,
						name,
						targetLink,
						note,
						prize,
						methods,
						status
					}) => (
						<div
							key={id}
							className="flex bg-primary-light dark:bg-primary-dark gap-2 p-4 border-[.01px] dark:border-gray-500 rounded hover:shadow-md hover:shadow-gray-600 cursor-pointer min-w-[100%] justify-between items-center"
						>
							<div className="flex flex-col gap-2">
								<h4 className="text-md sm:text-xl font-bold hover:underline">
									<a
										href={targetLink}
										target="_blank"
										rel="noreferrer"
									>
										{targetLink}
									</a>
								</h4>
								<h1 className="text-sm sm:text-md">{name}</h1>
								<p className="desc">{note ?? "-"}</p>
								<div className="flex flex-wrap gap-1 sm:gap-2">
									{methods.map((wb, idx) =>
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
									Price: {prize} MMK
								</p>
								<span
									className={`chip ${status
										.toLowerCase()
										.replace("_", "-")}`}
								>
									{formatChallengeStatusToString(status)}
								</span>
							</div>
						</div>
					)
				)}
			</div>
			<div className="bg-secondary-light dark:bg-secondary-dark gap-2 p-4 border-[.01px] dark:border-gray-500 rounded min-w-[400px] hidden xl:flex">
				<Form>
					<h1>Filter</h1>
				</Form>
			</div>
		</div>
	);
}
