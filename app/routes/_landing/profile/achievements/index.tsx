import { Challenge, ChallengeSubmission } from "@prisma/client";
import { json, LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { Medal } from "~/components/icons";
import { authenticate } from "~/model/auth.server";
import { getWonChallengesByUserId } from "~/model/challenge.server";
import { getUserById, UserInfo } from "~/model/user.server";
import { WebHackingMethods } from "~/utils/constant";
import { formatHackingMethod } from "~/utils/format";

export async function loader({ request }: LoaderFunctionArgs): Promise<
	TypedResponse<{
		user: UserInfo;
		achievements: (Challenge & { submission: ChallengeSubmission })[];
	}>
> {
	const user = await authenticate(request, userId => getUserById(userId));
	const achievements = await getWonChallengesByUserId(user.id);

	return json({
		user,
		achievements
	});
}

export default function ProfileRoute(): React.JSX.Element {
	const { achievements } = useLoaderData<typeof loader>();

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-xl">🏆 Achievements</h1>

			{achievements.length > 0 ? (
				<div className="flex mx-2 gap-4 flex-wrap">
					{achievements.map(ach => (
						<div
							key={ach.id}
							className="shadow shadow-gray-500 p-4 rounded flex flex-col gap-2 min-w-[300px] max-w-[350px] relative"
						>
							<h4 className="font-bold">{ach.name}</h4>
							<p>
								Target -
								<Link
									className="text-sm text-gray-800 dark:text-gray-300 font-semibold"
									to={ach.targetLink}
								>
									{ach.targetLink}
								</Link>
							</p>
							<p className="text-sm text-gray-800 dark:text-gray-300 font-semibold">
								Prize - {ach.prize.toLocaleString()} MMK
							</p>
							<small>{ach.submission.description}</small>
							<Link
								to={ach.submission.proofOfExploit}
								target="_blank"
								rel="noreferrer"
								className="text-[13px] hover:text-gray-600 font-bold text-gray-400"
							>
								<span>View Proof Of Exploit{">>"}</span>
							</Link>
							<div className="flex flex-wrap gap-1 sm:gap-2">
								{ach.methods.map((wb, idx) =>
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
							<Medal
								className="absolute bottom-0 right-0 m-2"
								width={50}
								height={50}
							/>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-700 dark:text-gray-400">
					You don&apos;t have any challenge yet.{" "}
					<Link className="hover:underline" to={"/challenge"}>
						Try now.
					</Link>
				</p>
			)}
		</div>
	);
}
