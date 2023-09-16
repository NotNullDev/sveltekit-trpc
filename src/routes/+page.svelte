<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { api } from '$lib/trpc';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { TRPCClientError } from '@trpc/client';
	import { onMount } from 'svelte';

	let response = '';
	const user = $page.data.session?.user;

	async function createUser() {
		try {
			const createdUser = await api.createUser.mutate({
				name: 'John',
				bio: 'I like to swim.'
			});
			response = `${createdUser.id} ${createdUser.name} ${createdUser.bio}`;
		} catch (e) {
			if (e instanceof TRPCClientError) {
				console.log(e.message);
				response = `Ups! Something went wrong! Error: [${e.message}]`;
			}
		}
	}

	function login() {
		signIn('github');
	}

	async function logout() {
		await signOut();
		invalidateAll();
	}

	onMount(createUser);
</script>

<div class="p-24 flex items-center gap-4">
	<div>{response}</div>
	<button class="btn btn-primary btn-sm" on:click={createUser}>Refresh</button>
</div>
<div class="mt-20">
	{#if !user}
		<button class="btn btn-primary" on:click={login}>login with github</button>
	{:else}
		<button class="btn btn-primary" on:click={logout}>logout</button>
	{/if}
	<div>User:</div>
	<pre class="whitespace-pre">
        {JSON.stringify(user, null, 2)}
    </pre>
</div>
