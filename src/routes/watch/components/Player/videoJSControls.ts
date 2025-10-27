import videojs from 'video.js';
import { mount } from 'svelte';

import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
import 'videojs-mobile-ui';

export class SvelteComponentWrapper extends videojs.getComponent('Component') {
	instance?: ReturnType<typeof mount>;

	createEl() {
		const element = videojs.dom.createEl('div', { class: 'vjs-svelte-wrapper' });
		this.instance = mount(this.options_.component, { target: element, props: this.options_.props });
		return element;
	}

	dispose() {
		this.instance?.$destroy();
		super.dispose();
	}
}

videojs.registerComponent('SvelteComponentWrapper', SvelteComponentWrapper);
