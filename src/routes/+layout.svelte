<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import '../app.css';

	function login() {
		signIn('github');
	}

	async function logout() {
		await signOut();
		invalidateAll();
	}

	const user = $page.data.session?.user;
</script>

<div class="min-h-screen h-full bg-base-200 overflow-hidden">
	<header class="flex justify-between shadow-base-100 p-4 items-center shadow">
		<a href="/">SvelteKit Lazy starter</a>
		{#if !user}
			<button class="btn btn-primary" on:click={login}>login with github</button>
		{:else}
			<button class="btn btn-primary" on:click={logout}>logout</button>
		{/if}
	</header>
	<slot />
</div>
