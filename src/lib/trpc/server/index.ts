import account from '$lib/trpc/routers/account';
import course from '$lib/trpc/routers/course';
import bundle from '../routers/bundle';
import category from '../routers/category';
import instructor from '../routers/instructor';
import pageText from '../routers/pageText';
import { createContext as createContextFn } from './context';
import { createRouter } from './router';

// optional
export const createContext = createContextFn;

// optional
export const responseMeta = () => {
	// ...
	return {
		// { headers: ... }
	};
};

export const router = createRouter()
	.merge('instructor.', instructor)
	.merge('account.', account)
	.merge('course.', course)
	.merge('category.', category)
	.merge('bundle.', bundle)
	.merge('pageText.', pageText);

export type Router = typeof router;
