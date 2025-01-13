import { ActionFunctionArgs, redirect, TypedResponse } from "@remix-run/node";
import { z } from "zod";
import { getImageUrl } from "~/utils/supabase.server";

const ImageLinkForm = z.object({
	url: z.string()
});

export async function action({
	request
}: ActionFunctionArgs): Promise<TypedResponse<Response>> {
	const formData = Object.fromEntries(await request.formData());

	const parseResult = ImageLinkForm.safeParse(formData);
	if (!parseResult.success) {
		return new Response();
	}

	const url = getImageUrl(parseResult.data.url);

	return redirect(url);
}
