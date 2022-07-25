/* eslint-disable */
import {
	PrismaClient,
	AccountType,
	type Bundle,
	type Feature,
	type Details,
	type Account,
	type Course,
	type Curriculum
} from '@prisma/client';
import crypto from 'crypto';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
	console.log('Starting seeding');

	await createInstructor();

	const bundles = await createBundles();

	const courses = await createCourses(bundles);
	await createAccounts();

	console.log('Seeding completed');
}

const createInstructor = async () => {
	return await prisma.instructor.create({
		data: {
			name: 'Christian Roed',
			image: 'https://www.filepicker.io/api/file/su7jLanLRmmanlmn5RyO',
			biography:
				"Hi! My name is Mosh Hamedani. I'm a software engineer with two decades of experience. I've taught millions of people how to code and how to become professional software engineers through my online courses and YouTube channel. I believe coding should be fun and accessible to everyone."
		}
	});
};

const createBundles = async () => {
	const bundles = [
		{
			name: 'Algebra',
			image: '/images/course/AlgebraThumbnail.png'
		},
		{
			name: 'Arithmetic',
			image: '/images/course/ArithmeticThumbnail.png'
		},
		{
			name: 'Calculus',
			image: '/images/course/CalculusThumbnail.png'
		},
		{
			name: 'Geometry',
			image: '/images/course/GeometryThumbnail.png'
		},
		{
			name: 'Statistics and Probability',
			image: '/images/course/StatisticsandProbabilityThumbnail.png'
		},
		{
			name: 'Trigonometry',
			image: '/images/course/TrigonometryThumbnail.png'
		}
	];

	return await Promise.all(
		bundles.map(async (bundle) => {
			return await createBundle(bundle.name, bundle.image, Math.random() * 10 + 2);
		})
	);
};

const createBundle = async (name: string, image: string, featuresCount: number = 5) => {
	// const details = await createDetails();

	const bundle = await prisma.bundle.create({
		data: {
			name,
			image,
			description: faker.lorem.sentence(36),
			price: 149,
			discount: Math.random() * 100,
			features: Array(Math.round(featuresCount))
				.fill(0)
				.map(() => faker.lorem.words(3)),
			details: {
				create: {
					title: faker.lorem.sentence(),
					description: faker.lorem.sentence(),
					whatYouWillLearn: Array(Math.round(Math.random() * 7 + 3))
						.fill(0)
						.map(() => faker.lorem.sentence()),
					whatYouWillBeAbleTo: Array(Math.round(Math.random() * 7 + 3))
						.fill(0)
						.map(() => faker.lorem.sentence())
				}
			}
		}
	});

	return bundle;
};

const createCourses = async (bundles: Bundle[]) => {
	const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

	const courses = new Array<Course>();

	for (const bundle of bundles) {
		for (let i = 0; i < difficulties.length; i++) {
			const difficulty = difficulties[i];
			courses.push(
				await createCourse(
					bundle,
					`${bundle.name} - ${difficulty}`,
					`/images/course/${bundle.name} – ${i + 1}.png`
				)
			);
		}
	}

	return courses;
};

const createCourse = async (bundle: Bundle, name: string, image: string) => {
	const selfBundle = await createBundle(name, image, Math.random() * 10 + 2);

	const course = await prisma.course.create({
		data: {
			name: name,
			description: faker.lorem.sentences(2),
			image,
			bundles: {
				connect: [
					{
						id: bundle.id
					},
					{
						id: selfBundle.id
					}
				]
			}
		}
	});

	// await createCurricula(course, Math.random() * 5 + 2);

	return course;
};

const createCurricula = async (course: Course, count: number = 2) => {
	for (let i = 0; i < count; i++) {
		const curriculum = await prisma.curriculum.create({
			data: {
				title: faker.lorem.sentence(),
				description: faker.lorem.sentence(),
				index: i + 1,
				course: {
					connect: {
						id: course.id
					}
				}
			}
		});

		await createCirruculumContent(curriculum, Math.random() * 5 + 2);
	}
};

const createCirruculumContent = async (curriculum: Curriculum, count: number = 1) => {
	for (let i = 0; i < count; i++) {
		// const video = await prisma.curriculumContentVideo.create({
		// 	data: {
		// 		link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		// 		description: faker.lorem.sentence(),
		// 		length: Math.floor(Math.random() * 240)
		// 	}
		// });

		const content = await prisma.curriculumContent.create({
			data: {
				title: faker.lorem.sentence(),
				description: faker.lorem.sentence(),
				index: i + 1,
				curriculum: {
					connect: {
						id: curriculum.id
					}
				},
				video: {
					create: {
						link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
						description: faker.lorem.sentence(),
						length: Math.floor(Math.random() * 240)
					}
				}
			}
		});
	}
};

const createAccounts = async () => {
	await createAdmin('admin@gmail.com');
	await createUser('user@gmail.com');
};

const createAdmin = async (email: string, password: string = 'password') => {
	const salt = crypto.randomBytes(16).toString('hex');

	return await prisma.account.create({
		data: {
			email,
			salt: salt,
			password: crypto
				.createHash('sha256')
				.update(password + salt)
				.digest('hex'),
			type: AccountType.ADMIN
		}
	});
};

const createUser = async (email: string, password: string = 'password') => {
	const salt = crypto.randomBytes(16).toString('hex');

	const account = await prisma.account.create({
		data: {
			email,
			salt: salt,
			password: crypto
				.createHash('sha256')
				.update(password + salt)
				.digest('hex'),
			type: AccountType.USER
		}
	});

	await createUserProfile(account);

	return account;
};

const createUserProfile = async (account: Account) => {
	return await prisma.userProfile.create({
		data: {
			lastName: 'LastName',
			firstName: 'FirstName',
			middleName: 'MiddleName',
			accountId: account.id
		}
	});
};

const createFeatures = async (count: number = 5) => {
	return await Promise.all(
		Array(Math.round(count))
			.fill(0)
			.map(async () => {
				return await prisma.feature.create({
					data: {
						name: faker.lorem.words(3),
						description: faker.lorem.words(6)
					}
				});
			})
	);
};

const createDetails = async () => {
	return await prisma.details.create({
		data: {
			title: faker.lorem.sentence(),
			description: faker.lorem.sentence(),
			whatYouWillLearn: Array(Math.round(Math.random() * 7 + 3))
				.fill(0)
				.map(() => faker.lorem.sentence()),
			whatYouWillBeAbleTo: Array(Math.round(Math.random() * 7 + 3))
				.fill(0)
				.map(() => faker.lorem.sentence())
		}
	});
};

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
