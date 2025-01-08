/**
 *
 * All the functions in this file work in server-only (https://remix.run/docs/en/main/file-conventions/-server)
 *
 * This file is only for User models
 */

import type { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import bcrypt from "bcrypt";
import { getSession } from "~/utils/session.server";

export type UserInfo = Pick<
	User,
	| "id"
	| "email"
	| "username"
	| "note"
	| "fbLink"
	| "gitHubLink"
	| "linkedInLink"
	| "redditLink"
	| "teleLink"
	| "profileImage"
	| "role"
	| "lastLoginIp"
	| "updatedAt"
	| "createdAt"
>;

export async function getUserByEmail(email: string): Promise<UserInfo | null> {
	return await db.user.findFirst({
		where: { email: email }
	});
}

export async function getUserById(id: string): Promise<UserInfo | null> {
	return await db.user.findFirst({
		where: { id: id },
		select: {
			passwordHash: false,
			id: true,
			email: true,
			profileImage: true,
			note: true,
			fbLink: true,
			linkedInLink: true,
			redditLink: true,
			gitHubLink: true,
			teleLink: true,
			role: true,
			username: true,
			lastLoginIp: true,
			createdAt: true,
			updatedAt: true
		}
	});
}

/**
 * This function is to check whether username is already existed or not
 * @param username
 * @returns ```boolean```
 */
export async function isUsernameAlreadyExistForRegister(
	username: string
): Promise<boolean> {
	const isUsernameExist = await db.user.findFirst({
		where: {
			username
		}
	});

	return isUsernameExist != null;
}

/**
 * This function is to check whether email is already existed or not
 * @param email
 * @returns ```boolean```
 */
export async function isEmailAlreadyExistForRegister(
	email: string
): Promise<boolean> {
	const isUsernameExist = await db.user.findFirst({
		where: {
			email
		}
	});

	return isUsernameExist != null;
}

export async function isUsernameAlreadyExist(
	userId: string,
	username: string
): Promise<boolean> {
	const isUsernameExist = await db.user.findFirst({
		where: {
			id: {
				not: userId
			},
			username
		}
	});

	return isUsernameExist != null;
}

export async function isEmailAlreadyExist(
	userId: string,
	email: string
): Promise<boolean> {
	const isEmailExist = await db.user.findFirst({
		where: {
			id: {
				not: userId
			},
			email
		}
	});

	return isEmailExist != null;
}

export async function createUser({
	username,
	email,
	password
}: {
	username: string;
	email: string;
	password: string;
}): Promise<UserInfo> {
	const passwordHash = await bcrypt.hash(password, 12);
	return await db.user.create({
		data: {
			email: email,
			username: username,
			passwordHash: passwordHash
		}
	});
}

export async function getUserId(request: Request) {
	const session = await getSession(request.headers.get("Cookie"));

	const userId = session.get("userId");
	if (!userId || typeof userId !== "string") {
		return null;
	}
	return userId;
}

export async function getUserForAuthentication(
	email: string
): Promise<User | null> {
	return await db.user.findFirst({
		where: {
			email: email
		}
	});
}

export async function updateUserData(
	id: string,
	payload: {
		username: string;
		email: string;
		note: string;
		facebook: string;
		telegram: string;
		reddit: string;
		linkedin: string;
		github: string;
	}
): Promise<{ ok: boolean }> {
	// update user
	try {
		await db.user.update({
			where: {
				id
			},
			data: {
				email: payload?.email,
				username: payload?.username,
				note: payload?.note ?? "",
				fbLink: payload?.facebook ?? "",
				redditLink: payload?.reddit ?? "",
				teleLink: payload?.telegram ?? "",
				linkedInLink: payload?.linkedin ?? "",
				gitHubLink: payload?.github ?? ""
			}
		});
		return { ok: true };
	} catch (error) {
		return { ok: false };
	}
}
