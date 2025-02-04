import {
	json,
	LinksFunction,
	LoaderFunctionArgs,
	TypedResponse
} from "@remix-run/node";
import { WebHackingMethods } from "~/utils/constant";
import indexLinks from "./index.css?url";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import {
	formatHackingMethod,
	formatChallengeStatusToString
} from "~/utils/format";
import {
	getChallenges,
	getTotalChallengeCount
} from "~/model/challenge.server";
import { Challenge } from "@prisma/client";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: indexLinks }
];

export async function loader({ request }: LoaderFunctionArgs): Promise<
	TypedResponse<{
		challenges: Challenge[];
		challengeCount: number;
	}>
> {
	const { searchParams } = new URL(request.url);
	const index = !isNaN(parseInt(searchParams.get("index") ?? "1", 10))
		? parseInt(searchParams.get("index") ?? "1", 10) - 1
		: 0;
	const challenges = await getChallenges({ tab: index });
	const challengeCount = await getTotalChallengeCount();

	return json({
		challenges,
		challengeCount
	});
}

export default function GetIndex() {
	const { challengeCount, challenges } = useLoaderData<typeof loader>();
	const navigate = useNavigate();

	return (
		<div className="m-5 overflow-auto w-full flex gap-4">
			{challenges.length === 0 ? (
				<p>No challenge yet! Come back later :(</p>
			) : (
				<>
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
									className="flex bg-primary-light dark:bg-primary-dark gap-2 p-4 border-[.01px] dark:border-gray-500 rounded hover:shadow-md hover:shadow-gray-600 cursor-pointer min-w-[100%] justify-between items-center transition-all duration-300"
									onClick={() =>
										navigate(`/challenges/${id}`)
									}
								>
									<div className="flex flex-col gap-2">
										<h4 className="text-md sm:text-xl font-bold hover:underline">
											<a
												href={targetLink}
												target="_blank"
												rel="noreferrer"
												onClick={e =>
													e.stopPropagation()
												}
											>
												{targetLink}
											</a>
										</h4>
										<h1 className="text-sm sm:text-md">
											{name}
										</h1>
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
									<div className="flex flex-col items-start min-w-[130px] max-w-[130px]">
										<p className="text-[12px] sm:text-[14px] whitespace-nowrap">
											Price: {prize.toLocaleString()} MMK
										</p>
										<span
											className={`chip ${status
												.toLowerCase()
												.replace("_", "-")}`}
										>
											{formatChallengeStatusToString(
												status
											)}
										</span>
									</div>
								</div>
							)
						)}
					</div>
					<div className="bg-secondary-light dark:bg-secondary-dark gap-2 p-4 border-[.01px] dark:border-gray-500 rounded min-w-[400px] hidden xl:flex sticky top-0">
						<Form className="flex flex-col w-full">
							<h2 className="font-bold">Filter</h2>
							<div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 my-2"></div>

							<p>Tabs</p>
							<div className="py-2 grid grid-cols-8 gap-4 sticky top-0 self-start min-w-full rounded">
								{Array.from({
									length:
										Math.ceil(challengeCount / 8) === 0
											? 1
											: Math.ceil(challengeCount / 8)
								}).map((_, index) => (
									<Link
										key={index}
										to={`?index=${index + 1}`}
									>
										<span className="py-1 px-3 border-[.01px] border-gray-800 dark:border-gray-500 rounded">
											{index + 1}
										</span>
									</Link>
								))}
							</div>
						</Form>
					</div>
				</>
			)}
		</div>
	);
}
