import { ResourceOptions } from '../types';

export default function (type: string, resourceOptions: ResourceOptions) {
	const options = resourceOptions || {};

	return type === 'js'
		? script(options as ResourceOptions)
		: link(options as ResourceOptions);

	function script(options: ResourceOptions) {
		const { url, async = false, id = '' } = options;

		return Object.assign(
			document.createElement('script'),
			{ async: false, defer: false },
			{ src: url, async, id }
		);
	}

	function link(options: ResourceOptions) {
		const { url, async = false, id = '' } = options;

		var assignObject = {
			href: url,
			media: 'all',
			id,
		};

		if (async) assignObject.media = 'print';

		const el = Object.assign(
			document.createElement('link'),
			{ rel: 'stylesheet' },
			assignObject
		);
		el.addEventListener(
			'load',
			() => ((this.onload = null), (this.media = 'all')),
			{ once: true, capture: false }
		);
		return el;
	}
}
