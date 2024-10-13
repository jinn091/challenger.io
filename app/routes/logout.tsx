import { ActionFunctionArgs, json, TypedResponse } from "@remix-run/node";
import { logout } from "~/model/auth.server";

export async function action({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<Response>> {
  return await logout(request);
}
