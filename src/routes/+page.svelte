<script lang="ts">
	import { page } from '$app/stores';
	import type { NewProduct, Product } from '$lib/schema';
	import { api } from '$lib/trpc';
	import { TRPCClientError } from '@trpc/client';
	import { onMount } from 'svelte';

	const user = $page.data.session?.user;

	let errors = {
		createdProductError: ''
	};

	let products: Product[] = [];
	let newProduct = getEmptyProduct();

	function getEmptyProduct(): NewProduct {
		return {
			title: '',
			description: '',
			price: 0
		};
	}

	async function createProduct() {
		try {
			const createdProduct = await api.createProduct.mutate(newProduct);
			products.push(createdProduct);
			products = products;
			console.log(createdProduct);
			newProduct = getEmptyProduct();
		} catch (e) {
			if (e instanceof TRPCClientError) {
				console.log(e.message);
				errors.createdProductError = `Ups! Something went wrong! Error: [${e.message}]`;
			}
		}
	}

	async function fetchAllProducts() {
		products = await api.getAllProducts.query();
	}
	onMount(fetchAllProducts);
</script>

<form
	class="p-24 flex items-center gap-4 app-card flex-col w-min mx-auto mt-20"
	on:submit|preventDefault={() => {
		createProduct();
	}}
>
	<h2 class="w-full text-2xl">New product</h2>
	<input
		class="input input-bordered"
		type="text"
		placeholder="Title"
		bind:value={newProduct.title}
	/>
	<input
		class="input input-bordered"
		type="text"
		placeholder="Description"
		bind:value={newProduct.description}
	/>
	<input
		class="input input-bordered"
		type="number"
		min="0"
		placeholder="Price"
		bind:value={newProduct.price}
	/>
	<button class="btn btn-primary btn-sm" type="submit">Create</button>
</form>
<div class="my-10 mx-auto w-[50vw] app-card">
	<h2 class="text-3xl mb-4">All products</h2>
	{#each products as product}
		<div class="bg-base-200/40 p-4 rounded-md flex flex-col my-2">
			<div class="text-3xl">{product.title}</div>
			<div>{product.price} EUR</div>
			<div class="font-light my-3">{product.description}</div>
			<button class="btn btn-primary self-end w-min whitespace-nowrap">Dummy button</button>
		</div>
	{/each}
</div>
<div class="my-20 container mx-auto app-card">
	<h2 class="text-2xl">Current user:</h2>
	<pre class="whitespace-pre">{JSON.stringify(user, null, 2)}</pre>
</div>
