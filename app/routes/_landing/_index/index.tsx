import { redirect } from "@remix-run/node";

export async function loader(): Promise<Response> {
	return redirect("/challenges");
}
