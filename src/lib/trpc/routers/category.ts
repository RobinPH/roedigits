import prisma from '$lib/prisma/client';
import z from 'zod';
import { createRouter } from '$lib/trpc/server/router';

const category = createRouter()
	.query('getAll', {
		resolve: async () => {
			return await prisma.category.findMany({
				include: {
					courses: true
				}
			});
		}
	})
	.query('get', {
		input: z.object({
			id: z.number()
		}),
		resolve: async ({ input }) => {
			return await prisma.category.findFirst({
				where: {
					id: input.id
				}
			});
		}
	});

export default category;
