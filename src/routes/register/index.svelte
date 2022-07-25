<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Form from '$lib/Form/Form.svelte';
	import Input from '$lib/Form/Input/Input.svelte';
	import PasswordInput from '$lib/Form/Input/PasswordInput.svelte';
	import TextInput from '$lib/Form/Input/TextInput.svelte';
	import trpc from '$lib/trpc/client';
	import { account, token } from '$store/account';
	import CryptoJS from 'crypto-js';
	import * as Yup from 'yup';

	const destination = $page.url.searchParams.get('destination');
</script>

<Form
	label="Register"
	submitButtonLabel="Register"
	validationSchema={Yup.object().shape({
		email: Yup.string().required('Required'),
		lastName: Yup.string().required('Required'),
		firstName: Yup.string().required('Required'),
		middleName: Yup.string(),
		password: Yup.string().required('Required')
	})}
	onSubmit={async ({ email, lastName, firstName, middleName, password }) => {
		const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();

		const response = await trpc.query('account.registerUser', {
			email,
			lastName,
			firstName,
			middleName,
			salt,
			password: CryptoJS.SHA256(password + salt).toString()
		});

		if (response) {
			token.set(response.token);
			account.set(response.account);

			goto(destination ?? '/');
		}
	}}
>
	<Input id="email" label="Email" component={TextInput} />
	<Input id="lastName" label="Last Name" component={TextInput} />
	<Input id="firstName" label="First Name" component={TextInput} />
	<Input id="middleName" label="Middle Name" component={TextInput} />
	<Input id="password" label="Password" component={PasswordInput} />
	<br />
	<span>
		Already have an account?
		<a href={`/login${destination ? '?destination=' + destination : ''}`}>Login</a>
	</span>
</Form>
