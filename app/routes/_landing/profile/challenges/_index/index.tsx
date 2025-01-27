import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { json, LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import { authenticate } from "~/model/auth.server";
import { getUserById } from "~/model/user.server";
import { getChallengesByUserId } from "~/model/challenge.server";
import { Challenge, ChallengeSubmission } from "@prisma/client";
import dayjs from "dayjs";
import { formatChallengeStatusToString } from "~/utils/format";
import { Edit } from "~/components/icons";

export async function loader({ request }: LoaderFunctionArgs): Promise<
	TypedResponse<{
		challenges: (Challenge & { submissions: ChallengeSubmission[] })[];
	}>
> {
	const user = await authenticate(request, userId => getUserById(userId));

	const challenges = await getChallengesByUserId(user.id);

	return json({ challenges });
}

export default function ProfileRoute(): React.JSX.Element {
	const { challenges } = useLoaderData<typeof loader>();

	return (
		<div className="flex flex-col gap-4 overflow-hidden">
			<h1 className="font-bold text-xl">Challenges</h1>

			<Link
				to="/profile/challenges/create"
				className="bg-[#b1b1b1] dark:bg-[#333] self-start lg:self-end px-4 py-2 rounded"
			>
				<span>New +</span>
			</Link>

			<div className="overflow-auto flex">
				<table className="overflow-auto">
					<thead>
						<tr>
							<th>#</th>
							<th>Title</th>
							<th>Target</th>
							<th>Prize</th>
							<th>Status</th>
							<th>Total Submissions</th>
							<th>Action</th>
							<th>Created At</th>
						</tr>
					</thead>
					<tbody>
						{challenges.map(ch => (
							<tr key={ch.id}>
								<td>
									<Link
										className="hover:underline"
										to={`/profile/challenges/${ch.id}`}
									>
										{ch.id}
									</Link>
								</td>
								<td>
									<Link
										className="hover:underline"
										to={`/profile/challenges/${ch.id}`}
									>
										{ch.name}
									</Link>
								</td>
								<td>
									<Link
										className="hover:underline"
										to={ch.targetLink}
									>
										Target ({ch.targetLink})
									</Link>
								</td>
								<td>{ch.prize.toLocaleString()}</td>
								<td>
									<span
										className={`chip ${ch.status
											.toLowerCase()
											.replace("_", "-")}`}
									>
										{formatChallengeStatusToString(
											ch.status
										)}
									</span>
								</td>
								<td>
									<Link
										className="hover:underline"
										to={`/profile/challenges/${ch.id}`}
									>
										{ch.submissions.length}
									</Link>
								</td>
								<td>
									{dayjs(ch.createdAt).format("DD/MM/YYYY")}
								</td>
								<td>
									<Link
										to={`/profile/challenges/${ch.id}/update`}
										className="flex items-center gap-2 hover:underline"
									>
										<Edit width={20} height={20} />
										<p>Edit</p>
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
