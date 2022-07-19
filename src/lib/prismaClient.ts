import prisma from '@prisma/client';
const { PrismaClient } = prisma;

const prismaClient = new PrismaClient();
export default prismaClient;
