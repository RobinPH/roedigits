import prisma from '$lib/prisma/client';
import z from 'zod';
import { createRouter } from '$lib/trpc/server/router';

const bundle = createRouter()
	.query('getAll', {
		resolve: async () => {
			return await prisma.bundle.findMany({
				include: {
					features: true,
					courses: {
						include: {
							bundles: {
								include: {
									courses: true
								}
							},
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
					},
					details: true
				}
			});
		}
	})
	.query('get', {
		input: z.object({
			id: z.number()
		}),
		resolve: async ({ input }) => {
			return await prisma.bundle.findFirst({
				where: {
					id: input.id
				},
				include: {
					features: true,
					courses: {
						include: {
							bundles: {
								include: {
									courses: true
								}
							},
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
					},
					details: true
				}
			});
		}
	})
	.query('getUniqueOwnersCount', {
		resolve: async () => {
			const bundles = await prisma.bundle.findMany({
				include: {
					users: true
				}
			});

			const userIds = new Set<number>();

			for (const bundle of bundles) {
				for (const user of bundle.users) {
					userIds.add(user.id);
				}
			}

			return userIds.size;
		}
	});

export default bundle;
