import z from 'zod';
import { AccountManager } from '$lib/account/Account';
import { TRPCError } from '@trpc/server';
import { createRouter } from '$lib/trpc/server/router';

const account = createRouter()
	.query('login', {
		input: z.object({
			email: z.string(),
			password: z.string()
		}),
		resolve: async ({ input }) => {
			return AccountManager.login(input.email, input.password);
		}
	})
	.query('register', {
		input: z.object({
			email: z.string(),
			salt: z.string(),
			password: z.string()
		}),
		resolve: async ({ input }) => {
			return await AccountManager.register(input);
		}
	})
	.query('registerUser', {
		input: z.object({
			email: z.string(),
			lastName: z.string(),
			firstName: z.string(),
			middleName: z.string().optional(),
			salt: z.string(),
			password: z.string()
		}),
		resolve: async ({ input }) => {
			return await AccountManager.registerUser(input);
		}
	})
	.query('getSalt', {
		input: z.object({
			email: z.string()
		}),
		resolve: async ({ input }) => {
			return AccountManager.getSalt(input.email);
		}
	})
	.middleware(async ({ ctx, next }) => {
		if (!ctx.account) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next();
	})
	.query('purchaseBundle', {
		input: z.object({
			id: z.number()
		}),
		resolve: async ({ input, ctx }) => {
			const account = ctx.account;

			if (!account) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			return await AccountManager.purchaseBundle(account.id, input.id);
		}
	})
	.query('hasAccessToBundle', {
		input: z.object({
			id: z.number()
		}),
		resolve: async ({ input, ctx }) => {
			const account = ctx.account;

			if (!account) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			return await AccountManager.hasAccessToBundle(account.id, input.id);
		}
	})
	.query('hasAccessToCourse', {
		input: z.object({
			id: z.number()
		}),
		resolve: async ({ input, ctx }) => {
			const account = ctx.account;

			if (!account) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			return await AccountManager.hasAccessToCouse(account.id, input.id);
		}
	})
	.query('myBundles', {
		resolve: async ({ ctx }) => {
			const account = ctx.account;

			if (!account) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			return await AccountManager.getBundles(account.id);
		}
	});

export default account;
