/**
 *
 * All the functions in this file work in server-only (https://remix.run/docs/en/main/file-conventions/-server)
 *
 * This file is only for Challenge models
 */

import {
	Challenge,
	ChallengeStatus,
	ChallengeSubmission
} from "@prisma/client";
import { WebHackingMethods } from "~/utils/constant";
import { db } from "~/utils/db.server";
import { getImageUrl } from "~/utils/supabase.server";
import { Result } from "~/utils/type.server";

/**
 * Use to create challenge
 */
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

/**
 * Get latest challenges
 */
export async function getChallenges({
	status,
	tab
}: {
	status?: ChallengeStatus;
	tab: number;
}) {
	return await db.challenge.findMany({
		where: {
			status: status
		},
		skip: tab * 8,
		take: 8,
		orderBy: [
			{
				status: "asc"
			},
			{
				createdAt: "desc"
			}
		]
	});
}

/**
 * Get total challenge count
 */
export async function getTotalChallengeCount(): Promise<number> {
	return await db.challenge.count({
		where: {
			status: ChallengeStatus.ON_GOING
		}
	});
}

/**
 * Get only challenge by id
 * @param challengeId
 */
export async function getChallengeById(challengeId: number): Promise<
	| (Challenge & {
			creator: { username: string };
			winner: { username: string } | null;
	  })
	| null
> {
	return await db.challenge.findUnique({
		where: {
			id: challengeId
		},
		select: {
			id: true,
			creatorId: true,
			winnerId: true,
			name: true,
			targetLink: true,
			prize: true,
			methods: true,
			status: true,
			note: true,
			createdAt: true,
			updatedAt: true,
			creator: {
				select: {
					username: true
				}
			},
			winner: {
				select: {
					username: true
				}
			}
		}
	});
}

/**
 * ```getChallengeByUserId``` function is to fetch the challenges using userId
 */
export async function getChallengesByUserId(
	userId: string
): Promise<(Challenge & { submissions: ChallengeSubmission[] })[]> {
	return await db.challenge.findMany({
		where: {
			creatorId: userId
		},
		include: {
			submissions: true
		},
		orderBy: {
			createdAt: "desc"
		}
	});
}

/**
 * This function is use to update challenge
 */

export async function updateChallengeById({
	id,
	name,
	targetLink,
	prize,
	methods,
	status,
	note,
	winnerId
}: {
	id: number;
	name?: string;
	targetLink?: string;
	prize?: number;
	methods?: WebHackingMethods[];
	status?: ChallengeStatus;
	note?: string;
	winnerId?: string;
}) {
	try {
		await db.challenge.update({
			data: {
				...(name && { name }),
				...(targetLink && { targetLink }),
				...(prize && { prize }),
				...(methods && { methods }),
				...(status && { status }),
				...(note && { note }),
				...(winnerId && { winnerId })
			},
			where: { id }
		});

		return { ok: true, data: null };
	} catch (error) {
		return { ok: false, error: null };
	}
}

/**
 * ```getWonChallengeByUserId``` function is used to fetch the challenges that user have won
 * @param userId
 * @param take Count of challenges to retrieve
 * @returns
 */
export async function getWonChallengesByUserId(
	userId: string,
	take?: number
): Promise<(Challenge & { submission: ChallengeSubmission })[]> {
	const challenges = await db.challenge.findMany({
		where: {
			winnerId: userId
		},
		orderBy: {
			id: "desc"
		},
		include: {
			submissions: {
				where: {
					userId: userId
				},
				take: 1,
				orderBy: {
					updatedAt: "desc"
				}
			}
		},
		take: take
	});

	// Transform the result to remove the `submissions` array
	const transformedChallenges = challenges.map(challenge => ({
		...challenge,
		submission: challenge.submissions[0] || null,
		submissions: undefined
	}));

	for (const challenge of transformedChallenges) {
		challenge.submission.proofOfExploit = getImageUrl(
			challenge.submission.proofOfExploit
		);
	}

	return transformedChallenges;
}
