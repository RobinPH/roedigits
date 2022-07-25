import prisma from '$lib/prisma/client';
import z from 'zod';
import { createRouter } from '$lib/trpc/server/router';

const course = createRouter()
	.query('getAll', {
		resolve: async () => {
			return await prisma.course.findMany({
				include: {
					categories: true,
					curricula: true
				}
			});
		}
	})
	.query('getAllBrief', {
		resolve: async () => {
			return await prisma.course.findMany({
				include: {
					categories: true
				}
			});
		}
	})
	.query('get', {
		input: z.object({
			id: z.number()
		}),
		resolve: async ({ input }) => {
			return await prisma.course.findFirst({
				where: {
					id: input.id
				},
				include: {
					bundles: true,
					categories: true,
					curricula: {
						include: {
							contents: {
								include: {
									video: true
								}
							}
						}
					}
				}
			});
		}
	});

export default course;
