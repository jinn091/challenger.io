import dayjs from "dayjs";
import { Challenge } from "@prisma/client";
import {
	ActionFunctionArgs,
	json,
	LoaderFunctionArgs,
	TypedResponse,
	unstable_parseMultipartFormData
} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { getChallengeById } from "~/model/challenge.server";
import {
	formatChallengeStatusToString,
	formatHackingMethod
} from "~/utils/format";
import { useState } from "react";
import { supabaseUploadHandler } from "~/utils/supabase.server";
import { z } from "zod";
import { authenticate } from "~/model/auth.server";
import { getUserById, getUserId } from "~/model/user.server";
import { Result } from "~/utils/type.server";
import { FormError } from "~/utils/error.server";
import { WebHackingMethods } from "~/utils/constant";
import {
	addChallengeSubmission,
	isChallengeSubmitted
} from "~/model/challenge-submission.server";

type ChallengeForm = z.infer<typeof ChallengeFormSchema>;

const ChallengeFormSchema = z.object({
	note: z.string().max(500, "Note must be less than 500 words."),
	challengeId: z
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
		}),
	fileInput: z.custom<File>(file => {
		// Ensure a file is provided
		if (!file) {
			return false;
		}

		// Validate file type
		const validMimeTypes = [
			"image/jpeg",
			"image/png",
			"image/jpg",
			"image/webp"
		];
		if (!validMimeTypes.includes(file.type)) {
			return false;
		}

		// Validate file size (e.g., max 5MB)
		const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSizeInBytes) {
			return false;
		}

		// If all checks pass, the file is valid
		return true;
	}, "Invalid image. Please upload a JPEG, PNG, or GIF file under 5MB.")
});

const UploadedFileSchema = z.object({
	note: z.string().max(500, "Note must be less than 500 words."),
	fileInput: z.string(),
	challengeId: z
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
	TypedResponse<Result<null, FormError<ChallengeForm, string>>>
> {
	const user = await authenticate(request, userId => getUserById(userId));
	const requestForFileHandling = request.clone();
	const fields = Object.fromEntries(await request.formData());

	const parseResult = ChallengeFormSchema.safeParse(fields);
	if (!parseResult.success) {
		console.log(parseResult.error.format());
		return json({
			ok: false,
			error: {
				fields,
				errors: parseResult.error.format(),
				message: ""
			}
		});
	}

	const challenge = await getChallengeById(parseResult.data.challengeId);

	if (
		(await isChallengeSubmitted(parseResult.data.challengeId, user.id)) ||
		challenge?.creatorId == user.id
	) {
		return json({
			ok: false,
			error: {
				fields,
				message: "Challenge has been already submitted!"
			}
		});
	}

	const timestamp = Date.now();
	// Upload file to the server
	const fileFormData = Object.fromEntries(
		await unstable_parseMultipartFormData(
			requestForFileHandling,
			supabaseUploadHandler(`${user.id}/${timestamp}`)
		)
	);

	const parseFileFormData = UploadedFileSchema.safeParse(fileFormData);
	if (!parseFileFormData.success) {
		return json({
			ok: false,
			error: {
				fields,
				errors: parseFileFormData.error.format(),
				message: ""
			}
		});
	}

	const result = await addChallengeSubmission({
		challengeId: parseFileFormData.data.challengeId,
		userId: user.id,
		proofOfExploit: parseFileFormData.data.fileInput,
		description: parseFileFormData.data.note
	});

	if (!result.ok) {
		// Return error message
		return json({
			ok: false,
			error: {
				fields,
				message: "Something went wrong while submitting :("
			}
		});
	}

	return json({
		ok: true,
		data: null
	});
}

export async function loader({ request, params }: LoaderFunctionArgs): Promise<
	TypedResponse<{
		challenge:
			| (Challenge & {
					creator: { username: string };
					winner: { username: string } | null;
			  })
			| null;
		isOwnChallenge?: boolean;
		isChallengeSubmitted?: boolean;
	}>
> {
	const userId = await getUserId(request);
	const id = params.id ?? "";
	const challenge = await getChallengeById(parseInt(id, 10));

	if (!userId) {
		return json({
			challenge
		});
	}

	const user = await getUserById(userId);

	if (!user) {
		return json({
			challenge
		});
	}

	return json({
		challenge,
		isOwnChallenge: challenge?.creatorId === userId,
		isChallengeSubmitted: await isChallengeSubmitted(
			parseInt(id, 10),
			user.id
		)
	});
}

export default function ChallengeIdRoute(): React.JSX.Element {
	const { challenge, isChallengeSubmitted, isOwnChallenge } =
		useLoaderData<typeof loader>();
	const [noteCount, setNoteCount] = useState<number>(0);
	const actionData = useActionData<typeof action>();
	const fieldErrors = !actionData?.ok ? actionData?.error.errors : null;
	const errorMessage = !actionData?.ok ? actionData?.error.message : null;

	if (challenge == null) {
		return (
			<div className="m-5">
				<h1 className="font-bold text-xl">Challenge</h1>
				<p>No challenge found.</p>
			</div>
		);
	}

	return (
		<div className="m-5 overflow-auto w-full">
			<h1 className="font-bold text-2xl">Challenge</h1>
			<div className="overflow-hidden w-full flex gap-4 mt-6">
				{/* Challenge Information and upload solution */}
				<div className="flex flex-col gap-2 flex-1">
					<h4>🎯 Challenge Target - {challenge.targetLink}</h4>
					<h4>🏹 Challenge Name - {challenge.name}</h4>
					<h4>
						🧑🏻‍🦰 Creator Profile -{" "}
						<Link to={`/users/${challenge.creatorId}`}>
							{challenge.creator.username}
						</Link>
					</h4>
					<p>💸 Prize - {challenge.prize.toLocaleString()}</p>
					<p>
						🕰 Created at -{" "}
						{dayjs(challenge.createdAt).isBefore(dayjs(), "month")
							? dayjs().format("DD/MM/YYYY")
							: dayjs().to(dayjs(challenge.createdAt))}
					</p>
					<p>
						🚀 Status -{" "}
						{formatChallengeStatusToString(challenge.status)}
					</p>

					<p className="flex gap-2">
						🧩 Methods -{" "}
						<span className="">
							{challenge.methods.map(ch => (
								<small
									className="bg-purple-900 text-white font-semibold text-xs rounded p-[.2rem] px-[.5rem] mx-[.1rem]"
									key={ch}
								>
									{formatHackingMethod(
										ch as WebHackingMethods
									)}
								</small>
							))}
						</span>
					</p>

					<p>📝 Note</p>
					<p className="bg-secondary-light dark:bg-secondary-dark self-start p-4 rounded-md text-sm font-semibold">
						{challenge.note}
					</p>
					<div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 my-2"></div>

					{isOwnChallenge ? (
						<p>
							You cannot submit your own challenge. Manage your
							challenge at{" "}
							<a
								className="hover:underline text-gray-700 dark:text-gray-400 font-semibold"
								href={`/profile/challenge-submissions/${challenge.id}`}
							>
								challenge-submission.
							</a>
						</p>
					) : !isChallengeSubmitted ? (
						<Form
							method="POST"
							className="flex flex-col gap-4"
							encType="multipart/form-data"
						>
							<div>
								<h1 className="font-bold text-xl">
									Submit Your Hack
								</h1>
								<p className="text-sm font-bold text-gray-400">
									Completed the challenge? Share your solution
									and show the world your skills!
								</p>
							</div>
							<input
								type="hidden"
								name="challengeId"
								value={challenge.id}
							/>
							<div className="flex flex-col dark:text-white gap-2">
								<label
									className="dark:text-white"
									htmlFor="note-input"
								>
									Description of Approach
								</label>
								<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
									<textarea
										id="note-input"
										name="note"
										className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white resize-none overflow-y-auto"
										rows={5}
										style={{ lineHeight: "1.25rem" }}
										maxLength={500}
										onChange={e =>
											setNoteCount(
												e.currentTarget.value.length
											)
										}
										defaultValue={""}
										placeholder="Describe how you exploited"
									/>
								</div>
								<small className="text-gray-500">
									{noteCount}/500
								</small>
								{fieldErrors?.note?._errors[0] && (
									<p className="error">
										{fieldErrors.note._errors[0]}
									</p>
								)}
							</div>{" "}
							<div className="flex flex-col dark:text-white gap-2">
								<label
									className="dark:text-white"
									htmlFor="image-input"
								>
									Proof of Exploit
								</label>
								<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
									<input
										type="file"
										name="fileInput"
										className="dark:text-gray-400"
									/>
								</div>
								{fieldErrors?.fileInput?._errors[0] && (
									<p className="error">
										{fieldErrors.fileInput._errors[0]}
									</p>
								)}
							</div>{" "}
							{errorMessage && (
								<p className="error">{errorMessage}</p>
							)}
							<button className="bg-green-500 dark:bg-blue-900 p-2 rounded self-start">
								<span>Submit</span>
							</button>{" "}
						</Form>
					) : (
						<p>
							Your challenge submission is pending. Wait for the
							owner response.
						</p>
					)}
				</div>
				{/* Challenge comments and replies  */}
				{/* <div className="bg-secondary-light dark:bg-secondary-dark gap-4 p-4 border-[.01px] dark:border-gray-500 rounded min-w-[400px] hidden xl:flex flex-col h-[80vh]">
					<h2>Comments</h2>
				</div>{" "} */}
			</div>
		</div>
	);
}
