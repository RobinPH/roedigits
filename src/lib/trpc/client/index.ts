import type { Router } from '$lib/trpc/server';
import { account, token } from '$store/account';
import * as _trpc from '@trpc/client';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import { get } from 'svelte/store';

const trpc = _trpc.createTRPCClient<Router>({
	url: '/trpc',
	headers: () => {
		const _token = get(token);

		const headers: Record<string, string> = {};

		if (_token) {
			headers['Authorization'] = `Bearer ${_token}`;
		}

		return headers;
	}
});
export default trpc;

type Query = keyof Router['_def']['queries'];
type Mutation = keyof Router['_def']['mutations'];

// Useful types 👇👇👇
export type InferQueryOutput<RouteKey extends Query> = inferProcedureOutput<
	Router['_def']['queries'][RouteKey]
>;
export type InferQueryInput<RouteKey extends Query> = inferProcedureInput<
	Router['_def']['queries'][RouteKey]
>;
export type InferMutationOutput<RouteKey extends Mutation> = inferProcedureOutput<
	Router['_def']['mutations'][RouteKey]
>;
export type InferMutationInput<RouteKey extends Mutation> = inferProcedureInput<
	Router['_def']['mutations'][RouteKey]
>;
