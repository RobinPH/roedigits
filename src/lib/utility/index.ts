import type { Bundle } from '@prisma/client';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const minuteFormat = (s: number) => {
	const ss = s % 60;
	const mm = Math.floor(s / 60);

	return `${mm}:${ss.toString().padStart(2, '0')}`;
};

export const getBundlePrice = (bundle: Bundle) => {
	return Math.round((parseFloat('' + bundle.price) - parseFloat('' + bundle.discount)) * 100) / 100;
};

export const getValueFromObject = (
	obj: Record<string, Record<string, any> | any>,
	key: string
): Record<string, any> | any => {
	if (!key) {
		return null;
	}

	const keys = key.split('.');

	if (!obj) {
		return obj;
	}

	if (keys.length === 1) {
		return obj[key];
	} else {
		return getValueFromObject(obj[keys[0]], keys.slice(1).join('.'));
	}
};

export const resize = <T>(arr: T[], newSize: number, defaultValue: T) => {
	while (newSize > arr.length) {
		arr.push(defaultValue);
	}

	while (arr.length > newSize) {
		arr.pop();
	}
};
