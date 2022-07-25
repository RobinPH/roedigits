import prisma from '$lib/prisma/client';
import z from 'zod';
import { createRouter } from '$lib/trpc/server/router';
import { TRPCError } from '@trpc/server';
import { AccountType } from '@prisma/client';

const bundle = createRouter()
	.query('getAll', {
		resolve: async () => {
			return await prisma.bundle.findMany({
				include: {
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
					}
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
					}
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
	})
	.middleware(async ({ ctx, next }) => {
		if (!ctx.account || ctx.account.type !== AccountType.ADMIN) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next();
	})
	.query('updateBundle', {
		input: z.object({
			id: z.number(),
			data: z.object({
				name: z.string().optional(),
				description: z.string().optional(),
				price: z.string().optional(),
				discount: z.string().optional(),
				image: z.string().optional(),
				features: z.array(z.string()).optional()
			})
		}),
		resolve: async ({ input }) => {
			return await prisma.bundle.update({
				where: {
					id: input.id
				},
				data: {
					name: input.data.name,
					description: input.data.description,
					price: input.data.price,
					discount: input.data.discount,
					image: input.data.image,
					...(input.data.features
						? {
								features: {
									set: input.data.features
								}
						  }
						: {})
				}
			});
		}
	})
	.query('updateBundleDetails', {
		input: z.object({
			id: z.number(),
			data: z.object({
				title: z.string().optional(),
				description: z.string().optional(),
				whatYouWillBeAbleTo: z.array(z.string()).optional(),
				whatYouWillLearn: z.array(z.string()).optional()
			})
		}),
		resolve: async ({ input }) => {
			return await prisma.details.update({
				where: {
					id: input.id
				},
				data: {
					title: input.data.title,
					description: input.data.description,
					...(input.data.whatYouWillBeAbleTo
						? {
								whatYouWillBeAbleTo: {
									set: input.data.whatYouWillBeAbleTo
								}
						  }
						: {}),
					...(input.data.whatYouWillLearn
						? {
								whatYouWillLearn: {
									set: input.data.whatYouWillLearn
								}
						  }
						: {})
				}
			});
		}
	});
export default bundle;
