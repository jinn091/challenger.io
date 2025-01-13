import { UploadHandler } from "@remix-run/node";
import { createClient } from "@supabase/supabase-js";
import { getFileExtension } from "./format";

// I use the ! to mark the env vars as defined but you should use some
// sort of validation to make sure they are!
// This creates our Supabase client, you can do many things with it!
export const supabase = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_TOKEN!
);
// This creates an utility for us to directly work with the bucket when needed
export const supabaseBucket = supabase.storage.from(
	process.env.SUPABASE_BUCKET!
);

export const supabaseUploadHandler =
	(path: string): UploadHandler =>
	async ({ data, filename, contentType }) => {
		const chunks = [];
		for await (const chunk of data) {
			chunks.push(chunk);
		}
		const buffer = Buffer.concat(chunks);
		// If there's no filename, it's a text field and we can return the value directly
		if (!filename) {
			const textDecoder = new TextDecoder();
			return textDecoder.decode(buffer);
		}

		const ext = getFileExtension(filename);
		const baseName = filename
			.replace(/[^a-zA-Z0-9_-]/g, "")
			.replace(ext, "");
		// Otherwise, it's an image and we'll save it to Supabase
		const { data: image, error } = await supabase.storage
			.from("images")
			.upload(`${path}_${baseName}${ext}`, buffer, {
				upsert: true,
				contentType
			});
		if (error || !image) {
			console.log(error);
			// TODO Add error handling
			throw error;
		}
		return image.path;
	};

// Used to retrieve the image public url from Supabase
export const getImageUrl = (path: string) => {
	return supabaseBucket.getPublicUrl(path).data.publicUrl;
};
