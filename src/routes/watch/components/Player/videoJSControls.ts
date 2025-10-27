import videojs from 'video.js';
import { showChannelSelector } from '../../store';
import Hamburger from '@material-symbols/svg-400/rounded/menu.svg?component';
import { createRawSnippet, mount } from 'svelte';
import type Player from 'video.js/dist/types/player';
import { Button } from '$lib/components/ui/button';

import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
import 'videojs-mobile-ui';
import ChannelSelector from '../ChannelSelector.svelte';

class ToggleChannelSelector extends videojs.getComponent('Button') {
	constructor(player: Player) {
		super(player);
		mount(Hamburger, {
			target: this.el(),
			props: { width: 24, height: 42, class: 'fill-white mx-2 hover:cursor-pointer' }
		});
	}

	handleClick = () => showChannelSelector.update((curr) => !curr);

	buildCSSClass() {
		return 'my-auto font-bold';
	}
}

class ChannelSelectorOverlay extends videojs.getComponent('Component') {
	constructor(player: Player) {
		super(player);
		mount(ChannelSelector, { target: this.el() });
	}
}

class CustomErrorDisplay extends videojs.getComponent('ErrorDisplay') {
	constructor(player: Player) {
		super(player);

		mount(Button, {
			target: this.el(),
			props: {
				onclick: () => {
					showChannelSelector.set(true);
				},
				class: 'z-10',
				children: createRawSnippet(() => ({ render: () => '<span>Change channel</span>' }))
			}
		});
	}

	buildCSSClass() {
		return 'h-dvh w-dvh flex gap-2 items-center flex-col justify-center max-w-80 m-auto vjs-hidden';
	}
}

videojs.registerComponent('ChannelSelectorOverlay', ChannelSelectorOverlay);
videojs.registerComponent('ErrorDisplay', CustomErrorDisplay);
videojs.registerComponent('ToggleChannelSelector', ToggleChannelSelector);
