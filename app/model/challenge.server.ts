/**
 *
 * All the functions in this file work in server-only (https://remix.run/docs/en/main/file-conventions/-server)
 *
 * This file is only for Challenge models
 */

import { ChallengeStatus } from "@prisma/client";
import { WebHackingMethods } from "~/utils/constant";
import { db } from "~/utils/db.server";
import { Result } from "~/utils/type.server";

export async function createChallenge({
	creatorId,
	name,
	targetLink,
	prize,
	methods,
	status,
	note
}: {
	creatorId: string;
	name: string;
	targetLink: string;
	prize: number;
	methods: WebHackingMethods[];
	status: ChallengeStatus;
	note: string;
}): Promise<Result<null, null>> {
	try {
		await db.challenge.create({
			data: {
				creatorId,
				name,
				targetLink,
				prize,
				methods,
				status,
				note
			}
		});

		return {
			ok: true,
			data: null
		};
	} catch (error) {
		return {
			ok: false,
			error: null
		};
	}
}
