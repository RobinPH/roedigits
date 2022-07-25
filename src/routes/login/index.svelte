<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Form from '$lib/Form/Form.svelte';
	import Input from '$lib/Form/Input/Input.svelte';
	import TextInput from '$lib/Form/Input/TextInput.svelte';
	import CryptoJS from 'crypto-js';
	import * as Yup from 'yup';
	import PasswordInput from '$lib/Form/Input/PasswordInput.svelte';
	import { account, token } from '$store/account';
	import trpc from '$lib/trpc/client/index';

	const destination = $page.url.searchParams.get('destination');

	account.subscribe((account) => {
		if (account) {
			goto(destination ?? '/');
		}
	});
</script>

<div class="pt-24">
	<Form
		label="Login"
		submitButtonLabel="Login"
		initialValues={{
			email: '',
			password: ''
		}}
		validationSchema={Yup.object().shape({
			email: Yup.string().required('Required'),
			password: Yup.string().required('Required')
		})}
		onSubmit={async ({ email, password }) => {
			const salt = await trpc.query('account.getSalt', { email });

			if (!salt) {
				console.log('Account does not exist');
				return;
			}

			const response = await trpc.query('account.login', {
				email,
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
		<Input id="password" label="Password" component={PasswordInput} />
		<br />
		<div class="flex justify-center">
			<div>
				Do not have an account?
				<a
					href={`/register${destination ? '?destination=' + destination : ''}`}
					class="text-warning">Register</a
				>
			</div>
		</div>
	</Form>
</div>
