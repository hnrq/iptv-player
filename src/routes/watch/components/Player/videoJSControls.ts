import videojs from 'video.js';
import { showChannelSelector } from '../../store';
import Hamburger from '@material-symbols/svg-400/rounded/menu.svg?component';
import { createRawSnippet, mount } from 'svelte';
import type Player from 'video.js/dist/types/player';
import { Button } from '$lib/components/ui/button';

class ToggleChannelSelector extends videojs.getComponent('Button') {
	constructor(player: Player) {
		super(player);
		mount(Hamburger, {
			target: this.el(),
			props: { class: 'h-6 fill-white' }
		});
	}

	handleClick = () => showChannelSelector.update((curr) => !curr);

	buildCSSClass() {
		return 'my-auto font-bold';
	}
}

class CustomErrorDisplay extends videojs.getComponent('ErrorDisplay') {
	constructor(player: Player) {
		super(player);

		mount(Button, {
			target: this.el(),
			props: {
				onclick: function () {
					showChannelSelector.set(true);
				},
				class: 'w-full !bg-primary hover:!bg-primary/90 z-10',
				children: createRawSnippet(() => ({ render: () => '<span>Change channel</span>' }))
			}
		});
	}

	buildCSSClass() {
		return 'h-screen w-screen flex gap-2 items-center flex-col justify-center max-w-80 m-auto vjs-hidden';
	}
}

videojs.registerComponent('ErrorDisplay', CustomErrorDisplay);
videojs.registerComponent('ToggleChannelSelector', ToggleChannelSelector);
