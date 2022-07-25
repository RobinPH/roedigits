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
