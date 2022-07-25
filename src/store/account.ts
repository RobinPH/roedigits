import type { Account } from '$lib/account/Account';
import type { InferQueryOutput } from '$lib/trpc/client';
import { createLocalStorageWriteable } from '$lib/utility/store';
import { writable } from 'svelte/store';

export const token = createLocalStorageWriteable<string>(
	'token',
	null,
	(v) => v,
	(v) => v
);

export const account = createLocalStorageWriteable<Account>(
	'account',
	null,
	JSON.stringify,
	JSON.parse
);

export const myBundles = writable<InferQueryOutput<'account.myBundles'>>([]);
