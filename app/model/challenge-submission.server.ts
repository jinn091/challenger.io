import {
	Challenge,
	ChallengeStatus,
	ChallengeSubmission,
	ChallengeSubmissionStatus
} from "@prisma/client";
import { db } from "~/utils/db.server";
import { getImageUrl } from "~/utils/supabase.server";
import { Result } from "~/utils/type.server";

/**
 * Add challenge submission
 */
export async function addChallengeSubmission({
	challengeId,
	userId,
	proofOfExploit,
	description
}: {
	challengeId: number;
	userId: string;
	proofOfExploit: string;
	description: string;
}): Promise<Result<null, string>> {
	try {
		await db.challengeSubmission.create({
			data: {
				challengeId,
				userId,
				description,
				proofOfExploit
			}
		});
		return { data: null, ok: true };
	} catch (error) {
		return { ok: false, error: "" };
	}
}

/**
 * This function is to check weather the challenge is submitted or not
 */
export async function isChallengeSubmitted(
	challengeId: number,
	userId: string,
	status: ChallengeSubmissionStatus = "PENDING"
) {
	const isSubmitted = await db.challengeSubmission.findMany({
		where: {
			userId,
			challengeId,
			status
		}
	});

	if (isSubmitted.length === 0) {
		return false;
	}

	return true;
}

/**
 * ```getChallengeSubmissionsByChallengeId``` function is use to fetch the challenge submissions.
 */
export async function getChallengeSubmissionsByChallengeId(
	challengeId: number,
	userId: string
): Promise<
	(ChallengeSubmission & {
		challenge: {
			name: string;
			status: ChallengeStatus;
			targetLink: string;
		};
		user: { username: string; id: string };
	})[]
> {
	const challenges = await db.challengeSubmission.findMany({
		where: {
			challengeId,
			challenge: {
				creatorId: userId
			}
		},
		include: {
			challenge: {
				select: {
					name: true,
					status: true,
					targetLink: true
				}
			},
			user: {
				select: {
					username: true,
					id: true
				}
			}
		},
		orderBy: {
			status: "asc"
		}
	});

	for (const challenge of challenges) {
		challenge.proofOfExploit = getImageUrl(challenge.proofOfExploit);
	}

	return challenges;
}

/**
 * getChallengeSubmissionById is used to fetch the challengeSubmission by id.
 * It also return the parent Challenge object
 */
export async function getChallengeSubmissionById(
	challengeReqId: number
): Promise<
	| (ChallengeSubmission & {
			challenge: Challenge;
	  })
	| null
> {
	return await db.challengeSubmission.findFirst({
		where: {
			id: challengeReqId
		},
		include: {
			challenge: true
		}
	});
}

/**
 * ```updateChallengeSubmissionStatus``` function is use to update only submission
 */
export async function updateChallengeSubmissionStatus({
	id,
	status
}: {
	id: number;
	status: ChallengeSubmissionStatus;
}) {
	await db.challengeSubmission.update({
		data: {
			status
		},
		where: {
			id
		}
	});
}

/**
 * ```updateChallengeSubmissionsStatus``` function is use to update all challenge submissions
 */
export async function updateChallengeSubmissionsStatus({
	challengeId,
	status
}: {
	challengeId: number;
	status: ChallengeSubmissionStatus;
}) {
	await db.challengeSubmission.updateMany({
		data: {
			status
		},
		where: {
			challengeId
		}
	});
}
