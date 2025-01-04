import { Form, useRouteLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { loader as profileRootLoader } from "../_layout";
import { Profile, Username } from "~/components/icons";
import { ActionFunctionArgs, json, TypedResponse } from "@remix-run/node";
import { FormError } from "~/utils/error.server";
import { z } from "zod";
import { authenticate } from "~/model/auth.server";
import { getUserById, updateUserData } from "~/model/user.server";
import { Result } from "~/utils/type.server";

type UpdateProfileForm = z.infer<typeof UpdateProfile>;

const UpdateProfile = z.object({
	email: z.string().trim().email("Email is not valid"),
	username: z
		.string()
		.min(4, "Username is too short")
		.max(10, "Username is too long")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username must not contain special characters"
		),
	note: z.string(),
	facebook: z.string(),
	telegram: z.string(),
	reddit: z.string(),
	linkedin: z.string(),
	github: z.string()
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
	const [noteCount, setNoteCount] = useState<number>(0);

	return (
		<Form
			method="POST"
			className="flex flex-col gap-4 min-w-[300px] overflow-y-auto pb-20"
		>
			<h1 className="font-bold text-xl">Update Information</h1>

			<div className="flex flex-col dark:text-white">
				<label className="dark:text-white" htmlFor="username-input">
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
			</div>

			<div className="flex flex-col dark:text-white">
				<label className="dark:text-white" htmlFor="email-input">
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
			</div>

			<div className="flex flex-col dark:text-white">
				<label className="dark:text-white" htmlFor="facebook-input">
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
			</div>

			<div className="flex flex-col dark:text-white">
				<label className="dark:text-white" htmlFor="telegram-input">
					Tele Link
				</label>
				<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
					<input
						id="telegram-input"
						type="text"
						name="telegram"
						className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
						defaultValue={data?.fbLink ?? ""}
						placeholder="Telegram URL"
					/>
				</div>
			</div>

			<div className="flex flex-col dark:text-white">
				<label className="dark:text-white" htmlFor="reddit-input">
					Reddit Profile
				</label>
				<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
					<input
						id="reddit-input"
						type="text"
						name="reddit"
						className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
						defaultValue={data?.fbLink ?? ""}
						placeholder="Reddit URL"
					/>
				</div>
			</div>

			<div className="flex flex-col dark:text-white">
				<label className="dark:text-white" htmlFor="linkedin-input">
					LinkedIn Profile
				</label>
				<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
					<input
						id="linkedin-input"
						type="text"
						name="linkedin"
						className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
						defaultValue={data?.fbLink ?? ""}
						placeholder="LinkedIn URL"
					/>
				</div>
			</div>

			<div className="flex flex-col dark:text-white">
				<label className="dark:text-white" htmlFor="github-input">
					GitHub Profile
				</label>
				<div className="bg-[#cfcece] dark:bg-secondary-dark flex items-center justify-between p-2 rounded gap-1 self-start min-w-[300px]">
					<input
						id="github-input"
						type="text"
						name="github"
						className="w-full outline-none bg-[#cfcece] dark:bg-secondary-dark dark:text-white"
						defaultValue={data?.fbLink ?? ""}
						placeholder="GitHub URL"
					/>
				</div>
			</div>
			<button className="bg-green-500 dark:bg-blue-900 p-2 rounded self-start">
				<span>Update Profile</span>
			</button>
		</Form>
	);
}
