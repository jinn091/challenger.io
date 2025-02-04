import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getLeaderboard } from "~/model/user.server";

export async function loader() {
	const topChallengers = await getLeaderboard();
	return json(topChallengers);
}

export default function GetLeaderBoard() {
	const topChallengers = useLoaderData<typeof loader>();

	return (
		<div className="m-5 overflow-auto w-full flex flex-col gap-4">
			<h1 className="font-bold text-xl">🏆 Leaderboard</h1>

			<table className="rounded-md overflow-hidden">
				<thead>
					<tr>
						<th>Ranking</th>
						<th>Username</th>
						<th>Total Won Challenges</th>
						<th>Total Won Prize</th>
					</tr>
				</thead>
				<tbody>
					{topChallengers.map((tc, idx) => (
						<tr key={idx}>
							<td>{idx + 1}</td>
							<td>
								<div className="flex items-center gap-2">
									{idx < 4 ? (
										<img
											src={
												idx + 1 === 1
													? "/images/crown-gold.webp"
													: idx + 1 === 2
													? "/images/crown-silver.webp"
													: "/images/crown-bronze.webp"
											}
											width={20}
											height={20}
											alt="Crown"
										/>
									) : (
										<span className="w-[20px] h-[20px]" />
									)}
									<Link
										to={"/"}
										className="mt-[2px] hover:underline hover:text-gray-800 dark:hover:text-gray-300"
									>
										{tc.username}
									</Link>
								</div>
							</td>
							<td>{tc.achievements}</td>
							<td>{tc.totalPrize.toLocaleString()} MMK</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
