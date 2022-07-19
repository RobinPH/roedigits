import type { Router } from '$lib/trpcServer';
import * as trpc from '@trpc/client';

export default trpc.createTRPCClient<Router>({ url: '/trpc' });
