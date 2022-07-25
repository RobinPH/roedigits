import { writable } from 'svelte/store';

export const createLocalStorageWriteable = <T>(
	key: string,
	defaultValue: T | null,
	encoder: (value: T) => string,
	decoder: (value: string) => T
) => {
	const localStorageValue = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
	const store = writable(localStorageValue ? decoder(localStorageValue) : defaultValue);

	store.subscribe((value) => {
		if (typeof window !== 'undefined') {
			if (value) {
				window.localStorage.setItem(key, encoder(value));
			} else {
				window.localStorage.removeItem(key);
			}
		}
	});

	return store;
};
