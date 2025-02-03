import {
	ChallengeStatus,
	ChallengeSubmission,
	ChallengeSubmissionStatus
} from "@prisma/client";
import {
	ActionFunctionArgs,
	json,
	LoaderFunctionArgs,
	SerializeFrom,
	TypedResponse
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { Action } from "~/components/icons";
import Popover from "~/components/Popover";
import { authenticate } from "~/model/auth.server";
import {
	getChallengeSubmissionById,
	getChallengeSubmissionsByChallengeId,
	updateChallengeSubmissionsStatus,
	updateChallengeSubmissionStatus
} from "~/model/challenge-submission.server";
import {
	getChallengeById,
	updateChallengeById
} from "~/model/challenge.server";
import { getUserById } from "~/model/user.server";
import { FormError } from "~/utils/error.server";
import { Result } from "~/utils/type.server";

type ActionFormSchema = z.infer<typeof ActionForm>;

const ActionForm = z.object({
	action: z.enum(["accept", "reject"]),
	challengeRequestId: z
		.string() // Accepts the string input
		.transform(val => {
			const parsed = parseInt(val, 10);
			if (isNaN(parsed)) {
				throw new Error("Invalid challenge ID");
			}
			return parsed;
		})
		.refine(val => !isNaN(val), {
			message: "Challenge ID must be a valid number."
		})
});

export async function action({
	request
}: ActionFunctionArgs): Promise<
	TypedResponse<Result<null, FormError<ActionFormSchema, string>>>
> {
	const user = await authenticate(request, userId => getUserById(userId));
	const fields = Object.fromEntries(await request.formData());

	const parseResult = ActionForm.safeParse(fields);
	if (!parseResult.success) {
		return json({
			ok: false,
			error: {
				fields,
				errors: parseResult.error.format()
			}
		});
	}

	const { challengeRequestId, action } = parseResult.data;

	// Get challenge request by id
	const challengeRequest = await getChallengeSubmissionById(
		challengeRequestId
	);

	if (
		!challengeRequest ||
		challengeRequest.userId == user.id ||
		challengeRequest.challenge.status === "DONE"
	) {
		return json({
			ok: false,
			error: {
				fields,
				message: "Challenge not found."
			}
		});
	}

	try {
		if (action == "accept") {
			await updateChallengeSubmissionsStatus({
				challengeId: challengeRequest.challengeId,
				status: ChallengeSubmissionStatus.FAIL
			});
			await updateChallengeSubmissionStatus({
				id: challengeRequest.id,
				status: ChallengeSubmissionStatus.SUCCESS
			});
			await updateChallengeById({
				id: challengeRequest.challengeId,
				winnerId: challengeRequest.userId,
				status: ChallengeStatus.DONE
			});
		} else {
			// Return eject
			await updateChallengeSubmissionStatus({
				id: challengeRequest.id,
				status: ChallengeSubmissionStatus.FAIL
			});
		}
	} catch (error) {
		return json({
			ok: false,
			error: {
				fields,
				message: "Something went wrong."
			}
		});
	}
	return json({ ok: true, data: null });
}

export async function loader({ request, params }: LoaderFunctionArgs): Promise<
	TypedResponse<{
		challengeSubmissions: (ChallengeSubmission & {
			challenge: { name: string; status: ChallengeStatus };
			user: { username: string; id: string };
		})[];
	}>
> {
	const user = await authenticate(request, userId => getUserById(userId));

	const challengeId = parseInt(params.id ?? "", 10);
	const challenge = await getChallengeById(challengeId);

	if (!challengeId || challenge == null || challenge.creatorId !== user.id) {
		//  Return challenge not found error
		throw new Response("Challenge Not Found!", {
			status: 404
		});
	}

	const challengeSubmissions = await getChallengeSubmissionsByChallengeId(
		challengeId,
		user.id
	);

	return json({ challengeSubmissions });
}

export default function ChallengeSubmissionRoute(): React.JSX.Element {
	const { challengeSubmissions } = useLoaderData<typeof loader>();

	return (
		<div className="flex flex-col gap-4 overflow-hidden h-full">
			<h1 className="font-bold text-xl">Challenge Submissions</h1>

			<table>
				<thead>
					<tr>
						<th>#</th>
						<th>Challenge Name</th>
						<th>Username</th>
						<th>Status</th>
						<th>Proof of Exploit</th>
						<th>Description</th>
						<th>Submitted At</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{challengeSubmissions.map(ch => (
						<ChallengeSubmissionRow ch={ch} key={ch.id} />
					))}
				</tbody>
			</table>
		</div>
	);
}

function ChallengeSubmissionRow({
	ch
}: {
	ch: SerializeFrom<
		ChallengeSubmission & {
			challenge: { name: string; status: ChallengeStatus };
			user: { username: string; id: string };
		}
	>;
}): React.JSX.Element {
	const [showAction, setShowAction] = useState<boolean>(false);
	const [imagePreview, setImagePreview] = useState<boolean>(false);
	const dialogRef = useRef<HTMLDialogElement>(null);

	return (
		<tr key={ch.id}>
			<td>{ch.id}</td>
			<td>{ch.challenge.name}</td>
			<td>{ch.user.username}</td>
			<td>
				<span className={`chip ${ch.status.toLowerCase()}`}>
					{ch.status.toLowerCase()}
				</span>
			</td>
			<td>
				<Link
					className="underline hover:opacity-70"
					to={ch.proofOfExploit}
					target="_blank"
					rel="noreferrer"
					onMouseEnter={() => {
						setImagePreview(true);
					}}
					onMouseLeave={() => setImagePreview(false)}
				>
					Proof of Exploit{" "}
				</Link>
				{imagePreview ? (
					<div className="absolute rounded bg-gray-900 p-2">
						<img
							width={150}
							height={200}
							src={ch.proofOfExploit}
							alt="pof"
						/>
					</div>
				) : null}
			</td>
			<td>
				<small className="font-normal text-[13px]">
					{ch.description}
				</small>
			</td>
			<td>{dayjs(ch.createdAt).fromNow()}</td>
			<td>
				{ch.challenge.status === ChallengeStatus.ON_GOING ? (
					<div className="relative">
						<button
							className="z-0"
							onClick={() => setShowAction(!showAction)}
						>
							<Action
								width={25}
								height={25}
								className="dark:fill-white fill-black"
							/>
						</button>
						{showAction ? (
							<>
								<Popover
									onClickOutside={() => setShowAction(false)}
								>
									<ul className="z-50 bg-secondary-light dark:bg-[#1c1c1c] rounded-md flex flex-col absolute right-0 border border-[#2c2c2a]">
										<li className="hover:bg-[green] hover:text-gray-800 rounded-md">
											<button
												type="button"
												onClick={() => {
													dialogRef.current?.showModal();
												}}
												className="px-8 py-2 font-semibold"
											>
												Accept
											</button>
										</li>
										<li className="hover:bg-[red] hover:text-gray-800 rounded-md">
											<Form method="POST">
												<input
													type="hidden"
													name="challengeRequestId"
													value={ch.id}
												/>
												<button
													type="submit"
													name="action"
													value="reject"
													className="px-8 py-2 font-semibold"
												>
													Reject
												</button>
											</Form>
										</li>
									</ul>
									<dialog
										ref={dialogRef}
										className="max-w-[400px]"
									>
										<h2 className="text-xl font-bold">
											Confirm choosing winner
										</h2>
										<div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 my-2"></div>
										<p className="py-2 font-bold text-gray-200">
											After marking {ch.user.username} as
											winner, other requests will
											automatically reject. Are you sure
											you want to continue?
										</p>
										<div className="flex justify-center gap-4">
											<Form method="POST">
												<input
													type="hidden"
													name="challengeRequestId"
													value={ch.id}
												/>
												<button
													name="action"
													value="accept"
													className="bg-green-600 px-4 py-1.5 rounded text-black font-semibold"
												>
													<span>Continue</span>
												</button>
											</Form>
											<button
												type="button"
												className="bg-red-600 px-4 py-1.5 rounded text-black font-semibold"
												onClick={() =>
													dialogRef.current?.close()
												}
											>
												<span>Cancel</span>
											</button>
										</div>
									</dialog>
								</Popover>
							</>
						) : (
							<></>
						)}
					</div>
				) : (
					<p>-</p>
				)}
			</td>
		</tr>
	);
}
