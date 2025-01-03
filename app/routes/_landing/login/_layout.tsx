import { Form, Link, useActionData } from "@remix-run/react";
import { useRef, useState } from "react";
import z from "zod";
import type { ActionFunctionArgs, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { FormError } from "~/utils/error.server";
import { login } from "~/model/auth.server";
import { HideIcon, Key, Profile } from "~/components/icons";
import ShowIcon from "~/components/icons/ShowIcon";

type LoginForm = z.infer<typeof LoginSchema>;

const LoginSchema = z.object({
  email: z.string().trim().email("Email is not valid"),
  password: z.string().min(8, "Password is too short"),
});

export async function action({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<FormError<LoginForm, string>>> {
  const fields = Object.fromEntries(await request.formData());

  const parseResult = LoginSchema.safeParse(fields);
  if (!parseResult.success) {
    return json({
      fields,
      errors: parseResult.error.format(),
      message: "",
    });
  }

  const loginResult = await login(parseResult.data);

  if (!loginResult?.ok) {
    return json({
      fields,
      message: loginResult.error.message,
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
      <Form
        className="rounded overflow-hidden mt-40"
        method="POST"
      >
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-col text-black">
            <label className="dark:text-white" htmlFor="email-input">Email</label>
            <div className="bg-[#cfcece] dark:bg-white flex items-center justify-between p-2 rounded gap-1">
              <Profile width={20} height={20} />
              <input
                id="email-input"
                type="email"
                name="email"
                className="w-full outline-none bg-[#cfcece] dark:bg-white"
                defaultValue={fields?.email ?? ""}
                placeholder="Email"
              />
            </div>
          </div>
          {fieldErrors?.email?._errors[0] && (
            <p className="error">{fieldErrors.email._errors[0]}</p>
          )}

          <div className="flex flex-col text-black">
            <label className="dark:text-white" htmlFor="password-input">Password</label>
            <div className="bg-[#cfcece] dark:bg-white flex items-center justify-between p-2 rounded gap-1">
              <Key width={20} height={20} />
              <input
                id="password-input"
                type="password"
                className="outline-none bg-[#cfcece] dark:bg-white"
                ref={passwordRef}
                name="password"
                defaultValue={fields?.password ?? ""}
                placeholder="Password"
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
            <p className="error">{fieldErrors.password._errors[0]}</p>
          )}
          {errorMessage && <p className="error">{errorMessage}</p>}

          <button className="bg-green-500 dark:bg-blue-900 p-2 rounded">
            <span>Login</span>
          </button>

          <div className="flex flex-col">
            <p className="text-black dark:text-gray-300">
              Don&apos;t you have an account ?
              <Link
                to={"/register"}
                className="text-gray-400 hover:underline mx-1 y-300 transition-all duration-75"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </Form>
    </div>
  );
}
