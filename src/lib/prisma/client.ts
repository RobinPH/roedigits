import _prisma from '@prisma/client';
const { PrismaClient } = _prisma;

const prisma = new PrismaClient();
export default prisma;
