<script lang="ts">
	import { api } from '$lib/trpc';
	import { TRPCClientError } from '@trpc/client';
	import { onMount } from 'svelte';

	let response = '';

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

	onMount(createUser);
</script>

<div class="p-24 flex gap-1 items-center gap-4">
	<div>{response}</div>
	<button class="btn btn-primary btn-sm" on:click={createUser}>Refresh</button>
</div>
