import videojs from 'video.js';
import { showChannelSelector } from '../store';

class ToggleChannelSelector extends videojs.getComponent('Button') {
	handleClick = () => showChannelSelector.update((curr) => !curr);

	buildCSSClass() {
		return 'mx-3 my-auto font-bold h-6';
	}
}

videojs.registerComponent('ToggleChannelSelector', ToggleChannelSelector);
