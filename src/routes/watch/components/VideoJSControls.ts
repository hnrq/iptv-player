import videojs from 'video.js';
import { showChannelSelector } from '../store';
import Hamburger from '@material-symbols/svg-400/sharp/menu.svg?component';
import { mount } from 'svelte';
import type Player from 'video.js/dist/types/player';

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

videojs.registerComponent('ToggleChannelSelector', ToggleChannelSelector);
