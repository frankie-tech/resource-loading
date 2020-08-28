import { ResourceOptions } from '../index.d';

export default function (type: string, options: ResourceOptions) {
	options = options || {};
	const tag =
		type === 'js'
			? document.createElement('script')
			: document.createElement('link');
	if (type === 'js')
		options = Object.assign(tag, { async: false, defer: true }, options);
	else if (type === 'css') {
		options = Object.assign(
			tag,
			{ rel: 'stylesheet', media: 'print' },
			options
		);
		tag.addEventListener(
			'load',
			() => {
				this.onload = null;
				this.media = 'all';
			},
			{ once: true, capture: true }
		);
	}
	if (options.callback !== undefined) {
		tag.addEventListener('load', event => options.callback(event), {
			once: true,
			capture: true,
		});
	}
	return tag;
}
