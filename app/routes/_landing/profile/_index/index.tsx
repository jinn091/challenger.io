import { Form, useActionData, useRouteLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { loader as profileRootLoader } from "../_layout";
import { Profile, Username } from "~/components/icons";
import { ActionFunctionArgs, json, TypedResponse } from "@remix-run/node";
import { FormError } from "~/utils/error.server";
import { z } from "zod";
import { authenticate } from "~/model/auth.server";
import {
	getUserById,
	isEmailAlreadyExist,
	isUsernameAlreadyExist,
	updateUserData
} from "~/model/user.server";
import { Result } from "~/utils/type.server";

type UpdateProfileForm = z.infer<typeof UpdateProfile>;

const UpdateProfile = z.object({
	email: z.string().trim().email("Email is not valid."),
	username: z
		.string()
		.min(4, "Username is too short")
		.max(10, "Username is too long")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username must not contain special characters."
		),
	note: z.string().max(100, "Note must be less than 100 words."),
	facebook: z
		.string()
		.regex(
			/^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
			"Invalid Facebook profile link"
		)
		.or(z.literal("")),
	telegram: z
		.string()
		.regex(
			/^(https?:\/\/)?(www\.)?t\.me\/[a-zA-Z0-9_-]+\/?$/,
			"Invalid Telegram profile link"
		)
		.or(z.literal("")),
	reddit: z
		.string()
		.regex(
			/^(https?:\/\/)?(www\.)?reddit\.com\/u\/[a-zA-Z0-9_-]+\/?$/,
			"Invalid Reddit profile link"
		)
		.or(z.literal("")),
	linkedin: z
		.string()
		.regex(
			/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
			"Invalid LinkedIn profile link"
		)
		.or(z.literal("")),
	github: z
		.string()
		.regex(
			/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
			"Invalid GitHub profile link"
		)
		.or(z.literal(""))
});

export async function action({
	request
}: ActionFunctionArgs): Promise<
	TypedResponse<Result<null, FormError<UpdateProfileForm, string>>>
> {
	const user = await authenticate(request, userId => getUserById(userId));

	const fields = Object.fromEntries(await request.formData());

	const parseResult = UpdateProfile.safeParse(fields);
	if (!parseResult.success) {
		return json({
			ok: false,
			error: {
				fields,
				errors: parseResult.error.format(),
				message: ""
			}
		});
	}

	// Check whether username is alraedy exist or not
	if (await isUsernameAlreadyExist(user.id, parseResult.data.username)) {
		return json({
			ok: false,
			error: {
				fields,
				message: "Username already exist."
			}
		});
	}

	// Check whether email is already exist or not
	if (await isEmailAlreadyExist(user.id, parseResult.data.email)) {
		return json({
			ok: false,
			error: {
				fields,
				message: "Email already exist."
			}
		});
	}

	// Update user
	const result = await updateUserData(user.id, parseResult.data);

	if (!result.ok) {
		return json({
			ok: false,
			error: {
				fields,
				message: "Cannot update user data."
			}
		});
	}

	return json({
		ok: true,
		data: null
	});
}

export default function ProfileRoute(): React.JSX.Element {
	const data = useRouteLoaderData<typeof profileRootLoader>(
		"routes/_landing/profile/_layout"
	);
	const [noteCount, setNoteCount] = useState<number>(data?.note?.length ?? 0);
	const actionData = useActionData<typeof action>();
	const fieldErrors = !actionData?.ok ? actionData?.error.errors : null;
	const errorMessage = !actionData?.ok ? actionData?.error.message : null;

	return (
		<Form
			method="POST"
			className="flex flex-col gap-4 min-w-[300px] overflow-y-auto pb-20"
		>
			<h1 className="font-bold text-xl">Update Information</h1>

			<div className="flex gap-20">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="username-input"
						>
							Username
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px] dark:text-white">
							<Username
								width={20}
								height={20}
								className="dark:fill-white"
							/>
							<input
								id="username-input"
								type="text"
								name="username"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={data?.username ?? ""}
								placeholder="Username"
								required
							/>
						</div>
						{fieldErrors?.username?._errors[0] && (
							<p className="error">
								{fieldErrors.username._errors[0]}
							</p>
						)}
					</div>

					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="email-input"
						>
							Email
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
							<Profile width={20} height={20} />
							<input
								id="email-input"
								type="email"
								name="email"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={data?.email ?? ""}
								placeholder="Email"
							/>
						</div>
						{fieldErrors?.email?._errors[0] && (
							<p className="error">
								{fieldErrors.email._errors[0]}
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
								maxLength={100}
								onChange={e =>
									setNoteCount(e.currentTarget.value.length)
								}
								defaultValue={data?.note ?? ""}
								placeholder="Note"
							/>
						</div>
						<small className="text-gray-500">{noteCount}/100</small>
						{fieldErrors?.note?._errors[0] && (
							<p className="error">
								{fieldErrors.note._errors[0]}
							</p>
						)}
					</div>

					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="facebook-input"
						>
							Facebook Link
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
							<input
								id="facebook-input"
								type="text"
								name="facebook"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={data?.fbLink ?? ""}
								placeholder="Facebook URL"
							/>
						</div>
						{fieldErrors?.facebook?._errors[0] && (
							<p className="error">
								{fieldErrors.facebook._errors[0]}
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="telegram-input"
						>
							Tele Link
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
							<input
								id="telegram-input"
								type="text"
								name="telegram"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={data?.teleLink ?? ""}
								placeholder="Telegram URL"
							/>
						</div>
						{fieldErrors?.telegram?._errors[0] && (
							<p className="error">
								{fieldErrors.telegram._errors[0]}
							</p>
						)}
					</div>

					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="reddit-input"
						>
							Reddit Profile
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
							<input
								id="reddit-input"
								type="text"
								name="reddit"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={data?.redditLink ?? ""}
								placeholder="Reddit URL"
							/>
						</div>
						{fieldErrors?.reddit?._errors[0] && (
							<p className="error">
								{fieldErrors.reddit._errors[0]}
							</p>
						)}
					</div>

					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="linkedin-input"
						>
							LinkedIn Profile
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
							<input
								id="linkedin-input"
								type="text"
								name="linkedin"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={data?.linkedInLink ?? ""}
								placeholder="LinkedIn URL"
							/>
						</div>
						{fieldErrors?.linkedin?._errors[0] && (
							<p className="error">
								{fieldErrors.linkedin._errors[0]}
							</p>
						)}
					</div>

					<div className="flex flex-col dark:text-white">
						<label
							className="dark:text-white"
							htmlFor="github-input"
						>
							GitHub Profile
						</label>
						<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
							<input
								id="github-input"
								type="text"
								name="github"
								className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
								defaultValue={data?.gitHubLink ?? ""}
								placeholder="GitHub URL"
							/>
						</div>
						{fieldErrors?.github?._errors[0] && (
							<p className="error">
								{fieldErrors.github._errors[0]}
							</p>
						)}
					</div>
				</div>
			</div>

			{errorMessage && <p className="error">{errorMessage}</p>}
			{actionData?.ok && (
				<p className="success">
					Your information has been successfully updated.
				</p>
			)}

			<button className="bg-green-500 dark:bg-blue-900 p-2 rounded self-start">
				<span>Update Profile</span>
			</button>
		</Form>
	);
}
