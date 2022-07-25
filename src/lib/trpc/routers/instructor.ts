import prisma from '$lib/prisma/client';
import z from 'zod';
import { createRouter } from '$lib/trpc/server/router';
import { AccountType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

const instructor = createRouter()
	.query('get', {
		input: z.object({
			id: z.number()
		}),
		resolve: async ({ input }) => {
			return await prisma.instructor.findFirst({
				where: {
					id: input.id
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
	.query('updateInstructor', {
		input: z.object({
			id: z.number(),
			data: z.object({
				name: z.string().optional(),
				image: z.string().optional(),
				biography: z.string().optional()
			})
		}),
		resolve: async ({ input }) => {
			await prisma.instructor.update({
				where: {
					id: input.id
				},
				data: {
					name: input.data.name,
					image: input.data.image,
					biography: input.data.biography
				}
			});
			return;
		}
	});

export default instructor;
