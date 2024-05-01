import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';


export default defineConfig(({mode}) =>	{
	if (mode === 'development') {
		const env = loadEnv(mode, './../../.env', '');
	}
	return {
		plugins: [
			sveltekit()
		]
	}
})
