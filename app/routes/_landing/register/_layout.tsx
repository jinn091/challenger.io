import { Form, Link, useActionData } from "@remix-run/react";
import { useRef, useState } from "react";
import z from "zod";
import type { ActionFunctionArgs, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { FormError } from "~/utils/error.server";
import { register } from "~/model/auth.server";
import { HideIcon, Key, Profile, Username } from "~/components/icons";
import ShowIcon from "~/components/icons/ShowIcon";
import {
	isEmailAlreadyExistForRegister,
	isUsernameAlreadyExistForRegister
} from "~/model/user.server";

type RegisterForm = z.infer<typeof RegisterSchema>;

const RegisterSchema = z.object({
	email: z.string().trim().email("Email is not valid"),
	password: z.string().min(8, "Password is too short"),
	username: z
		.string()
		.min(4, "Username is too short")
		.max(10, "Username is too long")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username must not contain special characters."
		)
});

export async function action({
	request
}: ActionFunctionArgs): Promise<
	TypedResponse<FormError<RegisterForm, string>>
> {
	const fields = Object.fromEntries(await request.formData());

	const parseResult = RegisterSchema.safeParse(fields);
	if (!parseResult.success) {
		return json({
			fields,
			errors: parseResult.error.format(),
			message: ""
		});
	}

	// Check whether username is alraedy exist or not
	if (await isUsernameAlreadyExistForRegister(parseResult.data.username)) {
		return json({
			fields,
			message: "Username already exist."
		});
	}

	// Check whether email is already exist or not
	if (await isEmailAlreadyExistForRegister(parseResult.data.email)) {
		return json({
			fields,
			message: "Email already exist."
		});
	}

	const loginResult = await register(parseResult.data);

	if (!loginResult?.ok) {
		return json({
			fields,
			message: loginResult.error.message
		});
	}

	return loginResult.data;
}

export default function LoginRoute() {
	const [showPassword, setShowPassword] = useState<"show" | "hide">("hide");
	const passwordRef = useRef<HTMLInputElement>(null);
	const actionData = useActionData<typeof action>();
	const fields = actionData?.fields;
	const fieldErrors = actionData?.errors;
	const errorMessage = actionData?.message;

	const passwordHandler = () => {
		if (showPassword === "show") {
			setShowPassword("hide");
			passwordRef.current!.type = "password";
		} else {
			setShowPassword("show");
			passwordRef.current!.type = "text";
		}
	};
	return (
		<div className="flex flex-col justify-start items-center w-full">
			<Form className="rounded overflow-hidden mt-40" method="POST">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col text-black">
						<label
							className="dark:text-white"
							htmlFor="username-input"
						>
							Username
						</label>
						<div className="bg-[#cfcece] dark:bg-white flex items-center justify-between p-2 rounded gap-1">
							<Username width={20} height={20} />
							<input
								id="username-input"
								type="text"
								name="username"
								className="w-full outline-none bg-[#cfcece] dark:bg-white"
								defaultValue={fields?.username ?? ""}
								placeholder="Username"
								required
							/>
						</div>
					</div>
					{fieldErrors?.username?._errors[0] && (
						<p className="error">
							{fieldErrors.username?._errors[0]}
						</p>
					)}

					<div className="flex flex-col text-black">
						<label
							className="dark:text-white"
							htmlFor="email-input"
						>
							Email
						</label>
						<div className="bg-[#cfcece] dark:bg-white  flex items-center justify-between p-2 rounded gap-1">
							<Profile width={20} height={20} />
							<input
								id="email-input"
								type="email"
								name="email"
								className="w-full outline-none bg-[#cfcece] dark:bg-white"
								defaultValue={fields?.email ?? ""}
								placeholder="Email"
								required
							/>
						</div>
					</div>
					{fieldErrors?.email?._errors[0] && (
						<p className="error">{fieldErrors.email._errors[0]}</p>
					)}

					<div className="flex flex-col text-black">
						<label
							className="dark:text-white"
							htmlFor="password-input"
						>
							Password
						</label>
						<div className="bg-[#cfcece] dark:bg-white flex items-center justify-between p-2 rounded gap-1">
							<Key width={20} height={20} />
							<input
								id="password-input"
								type="password"
								className="w-full outline-none bg-[#cfcece] dark:bg-white"
								ref={passwordRef}
								name="password"
								placeholder="Password"
								defaultValue={fields?.password ?? ""}
								required
							/>
							<button type="button" onClick={passwordHandler}>
								{showPassword === "show" ? (
									<ShowIcon width={20} height={20} />
								) : (
									<HideIcon width={20} height={20} />
								)}
							</button>
						</div>
					</div>
					{fieldErrors?.password?._errors[0] && (
						<p className="error">
							{fieldErrors.password._errors[0]}
						</p>
					)}
					{errorMessage && <p className="error">{errorMessage}</p>}

					<button className="bg-green-500 dark:bg-blue-900 p-2 rounded">
						<span>Register</span>
					</button>

					<div className="flex flex-col">
						<p className="text-black dark:text-gray-300">
							Already hve an account ?
							<Link
								to={"/login"}
								className="text-gray-400 hover:underline mx-1 y-300 transition-all duration-75"
							>
								Login
							</Link>
						</p>
						<Link
							to="/forgot-password"
							className="text-gray-400 hover:underline transition-all duration-75 flex-inline"
						>
							Forgot password
						</Link>
					</div>
				</div>
			</Form>
		</div>
	);
}
