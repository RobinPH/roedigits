import * as trpc from '@trpc/server';
import type { Context } from './context';

export const createRouter = () => trpc.router<Context>();
