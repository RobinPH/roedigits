import prisma from '$lib/prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AccountType, type Course } from '@prisma/client';
import { TRPCError } from '@trpc/server';
dotenv.config();

export type Account = {
	id: number;
	email: string;
	type: AccountType;
};

type AccountRegisterParams = {
	email: string;
	salt: string;
	password: string;
};

type UserRegisterParams = {
	email: string;
	lastName: string;
	firstName: string;
	middleName?: string | null;
	salt: string;
	password: string;
};

export class AccountManager {
	static JWT_SECRET = process.env.JWT_SECRET;

	static async purchaseBundle(accountId: number, bundleId: number) {
		const profile = await AccountManager.getProfile(accountId);

		const bundle = await prisma.bundle.findFirst({
			where: {
				id: bundleId
			}
		});

		if (!bundle) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bundle does not exist' });
		}

		if (profile.bundles.some((b) => b.id === bundleId)) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bundle already owned' });
		}

		try {
			await prisma.userProfile.update({
				where: {
					id: profile.id
				},
				data: {
					bundles: {
						set: [...profile.bundles, bundle].map((bundle) => {
							return {
								id: bundle.id
							};
						})
					}
				}
			});

			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	static async login(email: string, password: string) {
		const account = await prisma.account.findFirst({
			where: {
				email: email
			}
		});

		if (!AccountManager.JWT_SECRET) {
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Invalid JWT_SECRET' });
		}

		if (!account) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Account already exists' });
		}

		if (account.password !== password) {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Wrong password' });
		}

		const accountData = {
			id: account.id,
			email: account.email,
			type: account.type
		};

		const token = jwt.sign(account, AccountManager.JWT_SECRET);

		return {
			token,
			account: accountData
		};
	}

	static async register(account: AccountRegisterParams) {
		const existingAccount = await prisma.account.findFirst({ where: { email: account.email } });

		if (existingAccount) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Account already exists' });
		}

		try {
			await prisma.account.create({
				data: {
					email: account.email,
					salt: account.salt,
					password: account.password,
					type: AccountType.USER
				}
			});

			return await AccountManager.login(account.email, account.password);
		} catch (E) {
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
		}
	}

	static async registerUser(user: UserRegisterParams) {
		const login = await AccountManager.register({
			email: user.email,
			salt: user.salt,
			password: user.password
		});

		const account = await prisma.account.findFirst({
			where: {
				email: user.email
			}
		});

		if (!account) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Account creating failed. Something went wrong'
			});
		}

		const profile = await prisma.userProfile.create({
			data: {
				lastName: user.lastName,
				firstName: user.firstName,
				middleName: user.middleName,
				account: {
					connect: {
						id: account.id
					}
				}
			}
		});

		return login;
	}

	static async getBundles(accountId: number) {
		const account = await AccountManager.getAccount(accountId);

		const bundles = await prisma.bundle.findMany({
			include: {
				courses: true,
				users: true
			}
		});

		const ownedBundles = bundles.filter((b) => b.users.some((u) => u.accountId === account.id));

		const ownedCourses = new Array<Course>();

		for (const bundle of ownedBundles) {
			ownedCourses.push(...bundle.courses);
		}

		const accessableBundles = bundles
			.filter((b) => b.courses.every((c) => ownedCourses.some((oc) => oc.id === c.id)))
			.sort((a, b) => a.id - b.id);

		return accessableBundles;
	}

	static async hasAccessToBundle(accountId: number, bundleId: number) {
		const bundles = await AccountManager.getBundles(accountId);

		return bundles.some((b) => b.id === bundleId);
	}

	static async hasAccessToCouse(accountId: number, courseId: number) {
		const bundles = await AccountManager.getBundles(accountId);

		return bundles.some((b) => b.courses.some((c) => c.id === courseId));
	}

	static async getSalt(email: string) {
		const account = await prisma.account.findFirst({
			where: {
				email
			}
		});

		if (!account) {
			return null;
		}

		return account.salt;
	}

	static async getAccount(accountId: number) {
		const account = await prisma.account.findFirst({
			where: {
				id: accountId
			}
		});

		if (!account) {
			throw new TRPCError({ code: 'BAD_REQUEST', message: 'Account does not exist' });
		}

		return account;
	}

	static async getProfile(accountId: number) {
		const account = await AccountManager.getAccount(accountId);

		const profile = await prisma.userProfile.findFirst({
			where: {
				account
			},
			include: {
				bundles: true
			}
		});

		if (!profile) {
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Profile does not exist' });
		}

		return profile;
	}

	static async decodeAccountToken(token: string) {
		try {
			if (!AccountManager.JWT_SECRET) {
				throw new Error('JWT_SECRET is not defined');
			}

			const decoded = jwt.verify(token, AccountManager.JWT_SECRET);

			return decoded as Account;
		} catch (e) {
			console.log(e);
			return null;
		}
	}
}
