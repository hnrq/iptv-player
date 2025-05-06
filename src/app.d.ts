import '@poppanator/sveltekit-svg/dist/svg';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			flash?: {
				type: 'success' | 'info' | 'warning' | 'error' | 'message' | 'loading';
				message: string;
			};
		}
		interface PageState {
			modalShown?: 'add-playlist';
		}
		// interface Platform {}
	}
}

export {};
