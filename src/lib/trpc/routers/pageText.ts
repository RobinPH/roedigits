import prisma from '$lib/prisma/client';
import z from 'zod';
import { createRouter } from '$lib/trpc/server/router';
import { AccountType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

const pageText = createRouter()
	.query('get', {
		input: z.object({
			for: z.string()
		}),
		resolve: async ({ input }) => {
			return await prisma.pageText.findFirst({
				where: {
					for: input.for
				}
			});
		}
	})
	.middleware(async ({ ctx, next }) => {
		if (!ctx.account || ctx.account.type !== AccountType.ADMIN) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next();
	})
	.query('update', {
		input: z.object({
			data: z.object({
				homeTitle: z.string().optional(),
				homeDescription: z.string().optional(),
				missionTitle: z.string().optional(),
				missionDescription: z.string().optional(),
				visionTitle: z.string().optional(),
				visionDescription: z.string().optional(),
				subscribeTitle: z.string().optional()
			})
		}),
		resolve: async ({ input }) => {
			for (const [key, text] of Object.entries(input.data)) {
				await prisma.pageText.update({
					where: {
						for: key
					},
					data: {
						text
					}
				});
			}

			return;
		}
	});

export default pageText;
