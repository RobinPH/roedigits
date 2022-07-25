import { AccountManager } from '$lib/account/Account';
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';

export const createContext = async ({ request }: RequestEvent) => {
	const getAccountFromHeader = async () => {
		const authorization = request.headers.get('Authorization');
		if (authorization) {
			const token = authorization.split(' ')[1];

			return await AccountManager.decodeAccountToken(token);
		}
	};

	return {
		account: await getAccountFromHeader()
	};
};

export type Context = inferAsyncReturnType<typeof createContext>;
