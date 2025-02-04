import { Form, Link, useActionData } from "@remix-run/react";
import React, { useState } from "react";
import { WebHackingMethods } from "~/utils/constant";
import { formatHackingMethod } from "~/utils/format";
import { ActionFunctionArgs, json, TypedResponse } from "@remix-run/node";
import { authenticate } from "~/model/auth.server";
import { getUserById } from "~/model/user.server";
import { z } from "zod";
import { Result } from "~/utils/result.server";
import { FormError } from "~/utils/error.server";
import { createChallenge } from "~/model/challenge.server";
import { ChallengeStatus } from "@prisma/client";

type CreateChallengeSchema = z.infer<typeof CreateChallenge>;

const CreateChallenge = z.object({
	name: z
		.string()
		.regex(
			/^[a-zA-Z0-9_,.! ]+$/,
			"Name must not contain special characters"
		),
	target: z
		.string()
		.url("Target must be a valid URL.")
		.refine(url => {
			try {
				const parsedUrl = new URL(url);
				return !parsedUrl.search && !parsedUrl.hash;
			} catch (e) {
				return false;
			}
		}, "Target URL must not include query parameters, fragments, or scripts."),
	prize: z.number().min(0).max(1000000, "Prize must be less than 1,000,000."),
	note: z
		.string()
		.max(300, "Note must be less than 300 words.")
		.regex(
			/^[a-zA-Z0-9_,.! ]+$/,
			"Note must not contain special characters"
		),
	selectedMethods: z
		.array(
			z.enum(
				Object.keys(WebHackingMethods) as [
					keyof typeof WebHackingMethods
				]
			)
		)
		.nonempty("At least one hacking method must be selected")
});

export async function action({
	request
}: ActionFunctionArgs): Promise<
	TypedResponse<Result<null, FormError<CreateChallengeSchema, string>>>
> {
	const user = await authenticate(request, userId => getUserById(userId));

	const fields = Object.fromEntries(await request.formData());

	// Parse selectedMethods from the form
	const selectedMethods = JSON.parse(
		(fields.selectedMethods as string) || "[]"
	);

	console.log(selectedMethods);

	// Convert prize from string to number
	const parsedFields = {
		...fields,
		prize: parseFloat(fields.prize as string), // Convert to number
		selectedMethods
	};

	// const parseResult
	const parseResult = CreateChallenge.safeParse(parsedFields);
	if (!parseResult.success) {
		console.log("Here Buddy!");
		console.log(parseResult.error);
		return json({
			ok: false,
			error: {
				fields,
				errors: parseResult.error.format(),
				message: ""
			}
		});
	}

	const { name, target, prize, note } = parseResult.data;
	const createChallengeResult = await createChallenge({
		creatorId: user.id,
		name,
		targetLink: target,
		prize,
		methods: parseResult.data.selectedMethods,
		note,
		status: ChallengeStatus.ON_GOING
	});

	if (!createChallengeResult.ok) {
		return json({
			ok: false,
			error: {
				fields,
				message:
					"Something went wrong while creating challenge. Try again later :)"
			}
		});
	}

	return json({
		ok: true,
		data: null
	});
}

export default function ProfileRoute(): React.JSX.Element {
	const actionData = useActionData<typeof action>();
	const fields = !actionData?.ok ? actionData?.error.fields : null;
	const fieldErrors = !actionData?.ok ? actionData?.error.errors : null;
	const errorMessage = !actionData?.ok ? actionData?.error.message : null;
	const [noteCount, setNoteCount] = useState<number>(0);
	const [selectedMethods, setSelectedMethods] = useState<WebHackingMethods[]>(
		[]
	);
	const [availableMethods, setAvailableMethods] = useState<
		(keyof typeof WebHackingMethods)[]
	>(Object.keys(WebHackingMethods) as (keyof typeof WebHackingMethods)[]);

	// Handle method click: Add to selected
	const handleMethodClick = (method: WebHackingMethods) => {
		setAvailableMethods(prev => prev.filter(item => item !== method));
		setSelectedMethods(prev => [...prev, method]);
	};

	// Handle selected method click: Remove from selected
	const handleRemoveMethod = (method: WebHackingMethods) => {
		setSelectedMethods(prev => prev.filter(item => item !== method));
		setAvailableMethods(prev => [...prev, method]);
	};

	return (
		<Form method="POST" className="flex flex-col gap-4 overflow-auto">
			<h1 className="font-bold text-xl">Challenges</h1>

			<div className="flex flex-wrap lg:flex-nowrap lg:gap-20">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col dark:text-white">
						<label className="dark:text-white" htmlFor="name-input">
							Challenge Name
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px] dark:text-white">
							<input
								id="name-input"
								type="text"
								name="name"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={fields?.name ?? ""}
								placeholder="Name"
								required
							/>
						</div>
						{fieldErrors?.name?._errors[0] && (
							<p className="error">
								{fieldErrors.name._errors[0]}
							</p>
						)}
					</div>

					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="target-input"
						>
							Target Link
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px] dark:text-white">
							<input
								id="target-input"
								type="text"
								name="target"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={fields?.target ?? ""}
								placeholder="Target Link"
								required
							/>
						</div>
						{fieldErrors?.target?._errors[0] && (
							<p className="error">
								{fieldErrors.target._errors[0]}
							</p>
						)}
					</div>

					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="prize-input"
						>
							Prize
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start max-w-[180px] dark:text-white">
							<input
								id="prize-input"
								type="number"
								name="prize"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={fields?.prize ?? ""}
								placeholder="Prize"
								required
								min={0}
							/>
							<strong className="mx-2 text-[#706525]">MMK</strong>
						</div>
						<small>0 - 1,000,000 MMK</small>
						{fieldErrors?.prize?._errors[0] && (
							<p className="error">
								{fieldErrors.prize._errors[0]}
							</p>
						)}
					</div>

					<div className="flex flex-col dark:text-white">
						<label className="dark:text-white" htmlFor="note-input">
							Note
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
							<textarea
								id="note-input"
								name="note"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white resize-none overflow-y-auto"
								rows={5}
								style={{ lineHeight: "1.25rem" }}
								maxLength={300}
								onChange={e =>
									setNoteCount(e.currentTarget.value.length)
								}
								defaultValue={fields?.note ?? ""}
								placeholder="Note"
							/>
						</div>
						<small className="text-gray-500">{noteCount}/300</small>
						{fieldErrors?.note?._errors[0] && (
							<p className="error">
								{fieldErrors.note._errors[0]}
							</p>
						)}
					</div>
				</div>
				<div className="flex flex-col gap-4">
					{/* Selected Methods */}
					<h3>Selected Methods</h3>
					<div className=" bg-[#cfcece] dark:bg-secondary-dark min-w-[350px] rounded p-4 max-h-[200px] overflow-auto">
						<ul className="flex gap-2 flex-wrap">
							{selectedMethods.length !== 0 ? (
								selectedMethods.map(method => (
									<li
										key={method}
										onClick={() =>
											handleRemoveMethod(method)
										}
										className="text-[11px] font-bold border border-gray-600 p-2 rounded cursor-pointer selected"
									>
										{formatHackingMethod(method)}
									</li>
								))
							) : (
								<p className="text-gray-500">
									Please select hacking methods.
								</p>
							)}
						</ul>
					</div>{" "}
					{/* Available Methods */}
					<h3>Available Methods</h3>
					<div className=" bg-[#cfcece] dark:bg-secondary-dark min-w-[350px] rounded p-4 max-h-[200px] overflow-auto">
						<ul className="flex gap-2 flex-wrap">
							{availableMethods.map(method => (
								<li
									key={method}
									onClick={() => handleMethodClick(method)}
									className="text-[11px] font-bold border border-gray-600 p-2 rounded cursor-pointer"
								>
									{formatHackingMethod(method)}
								</li>
							))}
						</ul>
					</div>
					{fieldErrors?.selectedMethods &&
						fieldErrors?.selectedMethods[0]?._errors[0] && (
							<p className="error">
								{fieldErrors.selectedMethods[0]?._errors[0]}
							</p>
						)}
				</div>
			</div>

			<input
				type="hidden"
				name="selectedMethods"
				value={JSON.stringify(selectedMethods)}
			/>
			{errorMessage && <p className="error">{errorMessage}</p>}
			{actionData?.ok && (
				<p className="success">The challenge has been created!</p>
			)}

			<button className="bg-green-500 dark:bg-blue-900 p-2 rounded self-start">
				<span>Create Challenge</span>
			</button>

			<Link
				to="/profile/challenges"
				className="bg-[#b1b1b1] dark:bg-[#333] self-start px-4 py-2 rounded"
			>
				<span> {"<-"} Back </span>
			</Link>
		</Form>
	);
}
